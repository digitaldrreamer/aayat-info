import { persisted } from 'svelte-persisted-store'

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const user = persisted('preferences', {
    history: {
        search: [],
        usage: []
    },
    bookmarks: [],
    settings: {
        reciter: "",
        tafsir: "",
        quran: {
            en: "eng-yusufaliorig",
            ar: "ara-kingfahadquranc"
        },
    },
    pinned: [],
    showModal: true,
    quiz: {
        from: 1,
        to: 114,
        questions: 10
    }
})
