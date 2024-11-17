export default defineAppConfig({
  appName: 'Nuxt portfolio template',
  appDescription: 'This is a simple but beautiful portfolio template for designers and developers built with Nuxt and Tailwind CSS',
  profilePicture: '/assets/devbipu-photo.png',
  footerName: 'devbipu',
  email: 'devbipu@gmail.com',
  twitterUsername: 'developerbipu',
  phone: '(+880) 1787439657',
  openGraphImage: '/social-preview-img.png',
  socials: {
    github: 'https://github.com/devbipu',
    twitter: 'https://twitter.com/developerbipu',
    linkedin: 'https://www.linkedin.com/in/devbipu',
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
