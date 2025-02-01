<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { continuousVisualizer } from 'sound-visualizer'
    import { Button } from '$lib/components/ui/button/index'
    import * as Dialog from '$lib/components/ui/dialog/index'
    import { Mic, Square, Loader2, RotateCcw, Search } from 'lucide-svelte'
    import { toast } from 'svelte-sonner';

    let { isOpen = $bindable(false) } = $props()

    /** @type {MediaRecorder | null} */
    let mediaRecorder = $state(null)
    /** @type {MediaStream | null} */
    let stream = $state(null)
    /** @type {Blob | null} */
    let audioBlob = $state(null)
    /** @type {string | null} */
    let audioUrl = $state(null)
    /** @type {boolean} */
    let isRecording = $state(false)
    /** @type {boolean} */
    let isProcessing = $state(false)
    /** @type {HTMLCanvasElement} */
    let canvas = $state()
    /** @type {ReturnType<typeof continuousVisualizer> | null} */
    let visualizer = $state(null)
    /** @type {File | null} */
    let audioFile = $state(null)

    async function startRecording() {
        try {
            // Advanced audio constraints for better quality
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1,
                    sampleRate: 48000,
                    sampleSize: 16
                }
            })

            setupAudioVisualizer()

            const chunks: BlobPart[] = []
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm')
                    ? 'audio/webm'
                    : 'audio/mp3'
            })

            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data)
            }

            mediaRecorder.onstop = async () => {
                isProcessing = true

                try {
                    audioBlob = new Blob(chunks, { type: 'audio/mp3' })
                    audioUrl = URL.createObjectURL(audioBlob)

                    // Create a File object from the Blob
                    audioFile = new File([audioBlob], 'recording.mp3', {
                        type: 'audio/mp3',
                        lastModified: Date.now()
                    })

                    // Create a DataTransfer object to create a FileList
                    const dataTransfer = new DataTransfer()
                    dataTransfer.items.add(audioFile)

                    // Update the file input
                    if (fileInput) {
                        fileInput.files = dataTransfer.files
                    }
                } finally {
                    isProcessing = false
                }
            }

            mediaRecorder.start()
            isRecording = true
        } catch (err) {
            console.error('Error accessing microphone:', err)
        }
    }

    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop()
            isRecording = false

            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }

            if (visualizer) {
                visualizer.stop()
                visualizer = null
            }
        }
    }

    function resetRecording() {
        stopRecording()
        audioUrl = null
        audioBlob = null
        audioFile = null
        if (fileInput) fileInput.value = ''
    }

    function handleSearch() {
        if (audioFile) {
            transcribe(audioFile)
            isOpen = false
        }
    }

    function setupAudioVisualizer() {
        if (!stream || !canvas) return

        visualizer = continuousVisualizer(stream, canvas, {
            lineWidth: "thick",
            strokeColor: 'hsl(var(--primary))',
            slices: 100
        })

        visualizer.start()
    }

    /** @type {HTMLInputElement | null} */
    let fileInput = null

    onDestroy(() => {
        if (visualizer) {
            visualizer.stop()
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
        }
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl)
        }
    })

    async function transcribe(file) {
        const formData = new FormData();

        // Append the audio file to the FormData
        formData.append('audio', file); // 'audio' is the key, and 'file' is the audio file

        console.log(formData)
        const req = await fetch('/api/reflow/transcribe', {
            method: 'POST',
            body: formData,  // Send the FormData containing the file
        });

        if (!req.ok) {
            // Handle error if request fails
            toast.error("Failed to transcribe")
        }

        const response = await req.json();
        console.log(response)
        return response;  // Assuming the server returns a JSON response
    }
</script>

<Dialog.Root bind:open={isOpen}>
    <Dialog.Content class="sm:max-w-lg">
        <Dialog.Header>
            <Dialog.Title>Voice Recording</Dialog.Title>
            <Dialog.Description>
                Record your voice to search the Quran
            </Dialog.Description>
        </Dialog.Header>

        <div class="flex flex-col items-center space-y-4 py-4">
            <canvas
                    bind:this={canvas}
                    width={300}
                    height={200}
                    class="w-full rounded-md bg-secondary/50"
            />

            {#if audioUrl}
                <audio
                        controls
                        src={audioUrl}
                        class="w-full"
                >
                    <track kind="captions" />
                </audio>
            {/if}

            <input
                    type="file"
                    bind:this={fileInput}
                    accept="audio/mp3"
                    class="hidden"
            />
        </div>

        <Dialog.Footer class="flex-col sm:flex-row gap-2">
            {#if isRecording}
                <Button
                        variant="destructive"
                        class="gap-2 w-full sm:w-auto"
                        onclick={stopRecording}
                >
                    <Square class="h-4 w-4" />
                    Stop Recording
                </Button>
            {:else if isProcessing}
                <Button disabled class="gap-2 w-full sm:w-auto">
                    <Loader2 class="h-4 w-4 animate-spin" />
                    Processing...
                </Button>
            {:else if audioUrl}
                <div class="flex flex-col sm:flex-row w-full gap-2">
                    <Button
                            variant="default"
                            class="gap-2 w-full sm:w-auto"
                            onclick={handleSearch}
                    >
                        <Search class="h-4 w-4" />
                        Search with Recording
                    </Button>
                    <Button
                            variant="secondary"
                            class="gap-2 w-full sm:w-auto"
                            onclick={resetRecording}
                    >
                        <RotateCcw class="h-4 w-4" />
                        Record Again
                    </Button>
                    <Button
                            variant="outline"
                            class="w-full sm:w-auto"
                            onclick={() => {
                            resetRecording()
                            isOpen = false
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            {:else}
                <div class="flex flex-col sm:flex-row w-full gap-2">
                    <Button
                            variant="default"
                            class="gap-2 w-full sm:w-auto"
                            onclick={startRecording}
                    >
                        <Mic class="h-4 w-4" />
                        Start Recording
                    </Button>
                    <Button
                            variant="outline"
                            class="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white"
                            onclick={() => isOpen = false}
                    >
                        Cancel
                    </Button>
                </div>
            {/if}
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

