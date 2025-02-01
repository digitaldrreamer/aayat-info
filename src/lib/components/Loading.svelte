<script>
    import { fade, scale } from 'svelte/transition';

    let { message = "Loading..." } = $props()
</script>

<!-- Backdrop -->
<div
        class="fixed inset-0 z-50 select-none cursor-default"
        in:fade={{ duration: 200 }}
        out:fade={{ duration: 150 }}
>
    <!-- Blur overlay -->
    <div
            class="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm"
            aria-hidden="true"
    ></div>

    <!-- Modal -->
    <div
            class="fixed inset-0 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loading-title"
    >
        <div
                class="relative rounded-lg bg-white dark:bg-neutral-900 shadow-lg border border-neutral-200 dark:border-neutral-800 p-6 w-[90vw] max-w-sm"
                in:scale={{ duration: 200, start: 0.95 }}
                out:scale={{ duration: 150, start: 1.05 }}
        >
            <div class="flex flex-col items-center text-center space-y-4">
                <div class="relative">
                    <!-- Primary spinner -->
                    <img src="/loader.svg"
                            class="w-8 h-8"
                         alt="loading animation"
                    />
                </div>

                <div class="space-y-2">
                    <h2
                            id="loading-title"
                            class="text-lg font-semibold text-neutral-900 dark:text-white"
                    >
                        {message}
                    </h2>
                    <p class="text-sm text-neutral-500 dark:text-neutral-400">
                        Please wait while we process your request
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }
</style>