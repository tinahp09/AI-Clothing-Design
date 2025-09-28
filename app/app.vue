<!-- <NuxtRouteAnnouncer /> -->
<script setup>
import { ref } from 'vue'
const prompt = ref('')
const images = ref([])
const loading = ref(false)
const error = ref('')

const generate = async () => {
  if (!prompt.value) return
  loading.value = true
  error.value = ''
  images.value = []

  try {
    const res = await $fetch('/api/generate', {
      method: 'POST',
      body: { prompt: prompt.value },
    })
    images.value = res.data
  } catch (e) {
    error.value = '❌ Something went wrong. Try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8"
  >
    <h1 class="text-3xl font-bold mb-6 text-gray-800">
      👗 AI Fashion Generator
    </h1>

    <div class="w-full max-w-xl bg-white rounded-2xl shadow p-6">
      <input
        v-model="prompt"
        type="text"
        placeholder="Describe your fashion idea..."
        class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
      />
      <button
        @click="generate"
        :disabled="loading"
        class="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {{ loading ? 'Generating...' : 'Generate Design' }}
      </button>

      <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>
      <div v-if="loading" class="mt-4 text-gray-600 animate-pulse">
        ✨ Creating your design...
      </div>

      <div
        v-if="images?.length"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
      >
        <div
          v-for="(img, i) in images"
          :key="i"
          class="bg-gray-100 rounded-xl p-2"
        >
          <img :src="img.url" alt="AI Fashion" class="rounded-lg shadow" />
          <a
            :href="img.url"
            download
            class="block text-indigo-600 text-sm mt-2 text-center hover:underline"
          >
            ⬇ Download
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
