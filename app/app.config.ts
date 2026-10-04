const phone = '(+880) 1787439657'

// Same number, as a wa.me click-to-chat link. Derived rather than hardcoded so
// the number only ever has to change in one place.
const whatsapp = `https://wa.me/${phone.replace(/\D/g, '')}`

export default defineAppConfig({
  appName: 'Top Rated Full Stack PHP JavaScript Developer - Biplob Shaha',
  appDescription: `Full-Stack Laravel & Vue.js Developer with 5+ years of experience specializing in PHP, Laravel, CodeIgniter, and JavaScript frameworks like Vue.js and Nuxt.js. Passionate about creating efficient, user-friendly applications.`,
  profilePicture: '/assets/devbipu-photo.png',
  footerName: 'devbipu',
  email: 'devbipu@gmail.com',
  twitterUsername: 'developerbipu',
  phone,
  whatsapp,
  openGraphImage: '/social-preview.jpg',
  socials: {
    github: 'https://github.com/devbipu',
    twitter: 'https://twitter.com/developerbipu',
    linkedin: 'https://www.linkedin.com/in/devbipu',
    whatsapp,
  },
  ui: {
    primary: 'emerald',
    gray: 'zinc',
    notifications: {
      position: 'top-0 bottom-auto',
    },
    notification: {
      progress: {
        base: 'absolute bottom-0 end-0 start-0 h-0',
        background: 'bg-transparent dark:bg-transparent',
      },
    },
    input: {
      variant: {
        none: 'bg-gray-100 dark:bg-gray-900/40 border-1 border-gray-700 hover:border-gray-400 focus:border-gray-400 transition-colors duration-300 ease-in-out',
      },
    },
    textarea: {
      variant: {
        none: 'bg-gray-100 dark:bg-gray-900/40 border-1 border-gray-700 hover:border-gray-400 focus:border-gray-400 transition-colors duration-300 ease-in-out',
      },
    },
  },
})
