export type NavId = 'about'|'resume'|'works'|'blog'|'contact'|'products';

export interface WorkItem {
  title: string;
  type: 'Video'|'Link'|'Image'|'Gallery'|'Content';
  slug: string;
  href?: string;
}

export interface BlogPost {
  date: string;
  title: string;
  excerpt: string;
  href: string;
  slug: string;
}

export interface ResumeItem {
  date: string;
  name: string;
  company: string;
  desc: string;
  img?: string;
}

export interface SkillItem {
  name: string;
  percent?: number | null;
}

export interface SkillBlock {
  title: string;
  items: SkillItem[];
}

export const siteData = {
  "profile": {
    "name": "Mostafa Sherif",
    "subtitleRoles": [
      "Frontend Developer",
      "Software Developer",
      // "Data Scientist",
      // "Project Manager"
    ],
    "location": "Cairo, Egypt",
    "image": "/images/profile.jpg",
    "social": [
      {
        "label": "LinkedIn",
        "href": "https://www.linkedin.com/in/mostafa-sheriif/",
        "icon": "FaLinkedinIn"
      },
      {
        "label": "GitHub",
        "href": "https://github.com/Mostafa-Devfolio",
        "icon": "FaGithub"
      },
      {
        "label": "Fiverr",
        "href": "https://www.fiverr.com/users/mostafasheriif",
        "icon": "FaFiverr"
      },
    ],
    "downloadCvHref": "https://devfolio.net/my/MostafaSherif-CV.pdf"
  },
  "about": {
    "introTitle": "About Me",
    "intro": "Front-End Developer specializing in React.js, Next.js, and TypeScript, with experience delivering responsive, user-focused web applications for international clients. Strong foundation in building reusable UI components, integrating REST APIs, and managing client-side state using modern front-end patterns and tooling. Final-year Computer Science student at Arab Open University (AOU), expected graduation 2026. Actively seeking a Front-End Internship or Junior Front-End Developer role to contribute to product teams and grow in a collaborative, delivery-driven environment.",
    "info": [
      {
        "label": "Age",
        "value": "30"
      },
      {
        "label": "Phone",
        "value": "+201030505992"
      },
      {
        "label": "Email",
        "value": "support@devfolio.net"
      },
      {
        "label": "Freelance",
        "value": "Available"
      },
      {
        "label": "Address",
        "value": "Cairo, Egypt"
      }
    ],
    "services": [
      {
        "title": "Front-end",
        "desc": "Can develop modern frontend websites & mobile web apps using ReactJs, NextJs with 1 year experience."
      },
      {
        "title": "Back-End",
        "desc": "Currently learning NodeJs to be a backend developer with Route Academy in Egypt."
      },
      {
        "title": "Flutter Mobile Apps",
        "desc": "Currently learning dart to be a mobile app developer with Route Academy in Egypt."
      },
    ],
    "pricing": [
      {
        "title": "Popular",
        "price": "22",
        "period": "hour",
        "features": [
          "WorPress Development",
          "Installation Services",
          "SEO Audit",
          "Hosting & Domain",
          "WordPress Security"
        ]
      },
      {
        "title": "Pro",
        "price": "48",
        "period": "hour",
        "features": [
          "WorPress Development",
          "Installation Services",
          "SEO Audit",
          "Hosting & Domain new",
          "WordPress Security new"
        ]
      }
    ],
    "testimonials": [
      {
        "name": "Helen Floyd",
        "company": "Art Director",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      },
      {
        "name": "Robert Chase",
        "company": "CEO",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      },
      {
        "name": "John Doe",
        "company": "Art Director",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      }
    ],
    "facts": [
      {
        "name": "100+ Albumes Listened",
        "value": ""
      },
      {
        "name": "15+ Awards Won",
        "value": ""
      },
      {
        "name": "10,000+ Lines Written",
        "value": ""
      },
      {
        "name": "10+ Countries Visited",
        "value": ""
      }
    ]
  },
  "resume": {
    "experience": [
      {
            "date": "2021 - Present",
            "name": "Web Developer",
            "company": "Fiverr.",
            "desc": "Delivered multiple front-end projects for international clients, consistently receiving 5-star reviews. Built responsive, reusable UI components with React, TypeScript, and modern styling solutions (Tailwind CSS, Bootstrap, SCSS). Integrated REST APIs using Axios, handling loading/error states and improving data-flow reliability. Worked closely with clients to clarify requirements, propose solutions, and deliver clean, maintainable implementations. Improved UX through performance-minded UI work (component optimization, better rendering patterns, and cleaner architecture)."
      },
      {
            "date": "Jun 2024 - May 2024",
            "name": "React Front-End Developer (Training / Internship)",
            "company": "CompuEgy Software Management",
            "desc": "Trained and contributed as a React front-end developer within a team environment. Developed UI screens and reusable components, following consistent coding standards. Worked with APIs and application state while collaborating with team members to deliver features and fixes."
      },
],
    "education": [
      {
            "date": "2023 - Final Year, Expected Graduation: 2026",
            "name": "B.Sc. in Computer Science",
            "company": "Arab Open University (AOU) – Egypt",
            "desc": "Focus areas include software development, web technologies, and problem-solving methodologies."
      },
      {
            "date": "2018 - 2022",
            "name": "HEM Engineer",
            "company": "Faculty of Engineering, Cairo University",
            "desc": "I was a student in faculty of engineering in Cairo university in HEM Department but I didn't complete my studies there because my passion was for programming more than engineering.NOTE, I transferred from Cairo University's Faculty of Engineering to the Faculty of Computers and Information of my own free will and was not expelled from the university."
      },
],
    "certifications": [
      {
            "date": "Jun 2024 - Jan 2025",
            "name": "Front-End Web Development Diploma (ReactJs)",
            "company": "Route Academy in Egypt",
            "desc": "I have studied HTML5, CSS3, Javascript (ES6+), Bootstrap, Tailwind, ReactJS, NextJS, Typescript, ReduxToolkit with react, ZOD Validation, Dealing with APIs, React Query and many more, with many other real projects which makes me a ready frontend reactjs developer."
      },
      {
        "date": "Aug 2023 - Feb 2024",
        "name": "The Complete Full-Stack Web Development Bootcamp",
        "company": "Udemy",
        "desc": "I have studied within the course both frontend (reactJs) and backend (nodejs)."
      },
      {
        "date": "Jan 2023 - May 2023",
        "name": "Meta Front-End Developer Professional Certificate",
        "company": "Coursera",
        "desc": "I have studied HTML5, CSS3, Javascript (ES6+), Bootstrap and ReactJS."
      },
      {
            "date": "Jan 2026 - Present",
            "name": "Backend-End Development Diploma (NodeJs)",
            "company": "Route Academy in Egypt",
            "desc": "I'm currently studying NodeJs at Route Academy to be a backend developer."
      },
      {
            "date": "Nov 2025 - Present",
            "name": "Flutter Mobile App Development Diploma (Dart)",
            "company": "Route Academy in Egypt",
            "desc": "I'm currently studying flutter at Route to be android/ios developer ."
      },
],
    "skills": [
      {
        "title": "Coding",
        "items": [
          {
            "name": "HTML / CSS",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "JavaScript",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "ReactJs",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "NextJs with Typescript",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "Strapi",
            "percent": 80,
            "dots": 0
          },
        ]
      },
      {
        "title": "Knowledge",
        "items": [
          {
            "name": "Website hosting",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Dealing with Ubuntu servers (VPS Hosting)",
            "percent": null,
            "dots": 0
          },
          {
            "name": "WordPress Development",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Hosting Installation",
            "percent": null,
            "dots": 0
          },
          {
            "name": "SEO Optimize",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Responsive and mobile-ready designs",
            "percent": null,
            "dots": 0
          },
        ]
      },
      {
        "title": "Skills",
        "items": [
          {
            "name": "Problem Solver",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Team Collaboration",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Clear Communication",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Attention to Detail",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Fast Learner",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Time Management",
            "percent": null,
            "dots": 0
          },
          {
            "name": "Adaptability",
            "percent": null,
            "dots": 0
          },
        ]
      },
      {
        "title": "Front-end",
        "items": [
          {
            "name": "Java",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "ReactJs",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "NextJs with Typescript",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "Dealing with APIs",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "Tailwind",
            "percent": 90,
            "dots": 0
          },
          {
            "name": "Responsive Designs",
            "percent": 90,
            "dots": 0
          }
        ]
      },
      {
        "title": "Languages",
        "items": [
          {
            "name": "English",
            "percent": 70,
            "dots": 0
          },
          {
            "name": "Arabic",
            "percent": 100,
            "dots": 0
          },
        ]
      }
    ],
    "quote": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "quoteAuthor": "Ryan",
    "quoteRole": "Adlard"
  },
  "works": {
    "filters": [
      "All",
      "Video",
      "Link",
      "Image",
      "Gallery",
      "Content"
    ],
    "items": [
      {
        "title": "Pyramid — Multi-Business, Multi-Vendor Marketplace Platform",
        "type": "Link",
        "slug": "pyramid-marketplace-platform",
        "href": "https://pyramids.devfolio.net/"
      },
      {
        "title": "Devfolio Portfolio (Mine)",
        "type": "Link",
        "slug": "devfolio-portfolio",
        "href": "https://devfolio.net/"
      },
      {
        "title": "Facebook Clone (Small project)",
        "type": "Link",
        "slug": "facebook-clone",
        "href": "https://fb.devfolio.net/"
      },
      // {
      //   "title": "Weather Mobile App",
      //   "type": "Gallery",
      //   "slug": "weather-mobile-app"
      // },
      // {
      //   "title": "Sushi Parlour App",
      //   "type": "Gallery",
      //   "slug": "sushi-parlour-app"
      // },
      // {
      //   "title": "Unicode Web App",
      //   "type": "Video",
      //   "slug": "unicode-web-app",
      //   "href": "https://vimeo.com/97102654"
      // },
      // {
      //   "title": "SOUNDS Web App",
      //   "type": "Content",
      //   "slug": "sounds-web-app"
      // },
      // {
      //   "title": "Future Web App",
      //   "type": "Image",
      //   "slug": "future-web-app"
      // },
      // {
      //   "title": "Furniture Mobile App",
      //   "type": "Content",
      //   "slug": "furniture-mobile-app"
      // },
      // {
      //   "title": "ChatApp Mobile",
      //   "type": "Image",
      //   "slug": "chatapp-mobile"
      // }
    ]
  },
  "blog": {
    "posts": [
      {
        "date": "December 12, 2025 - Present",
        "title": "Pyramid — Multi-Business, Multi-Vendor Marketplace Platform",
        "excerpt": "Pyramid is a multi-business, multi-vendor marketplace (restaurants, groceries, pharmacies, and e-commerce) built with Next.js + TypeScript and a real Strapi backend. It includes authentication, product catalogs with variants, coupons/banners, cart/checkout with online payments, order tracking, and post-delivery reviews—still in development with upcoming UI polish and an admin dashboard\u2026",
        "href": "/2025/12/12/pyramid-marketplace-platform/",
        "slug": "pyramid-marketplace-platform"
      },
      {
        "date": "October 02, 2025",
        "title": "Small Project Website like Facebook",
        "excerpt": "I’m currently building a small Facebook-style web app to sharpen my front-end engineering skills. The project is developed with React.js, using React Query, Context API for state management, Axios for API communication, and Tailwind CSS for styling\u2026",
        "href": "/2020/04/28/by-spite-about-do-of-allow/",
        "slug": "by-spite-about-do-of-allow"
      },
      {
        "date": "September 28, 2025",
        "title": "Last Year at Faculty of Computer Science",
        "excerpt": "After years of dreaming about becoming a developer, I’m finally living that goal. This is my final year at the Faculty of Computer Science, and I’m maintaining a GPA of 3.55+ — Alhamdulillah\u2026",
        "href": "/2025/09/28/last-year-at-computer-science/",
        "slug": "last-year-at-computer-science"
      },
      {
        "date": "June 22, 2025",
        "title": "My Journey at Faculty of Engineering, Cairo University",
        "excerpt": "My journey started at the Faculty of Engineering, Cairo University, where I studied Biomedical Engineering (HEM) for four years (2018–2022). It was a valuable chapter—but deep down, I always knew my real passion was programming and building things with computers.\u2026",
        "href": "/2025/06/22/journey-to-engineering/",
        "slug": "journey-to-engineering"
      },
      {
        "date": "June 10, 2025",
        "title": "The devfolio's start",
        "excerpt": "This is the date where i created this portfolio",
        "href": "/2025/06/10/devfolio-start/",
        "slug": "devfolio-start"
      }
    ]
  },
  "contact": {
    "info": [
      {
        "label": "Address",
        "value": "Cairo, Egypt"
      },
      {
        "label": "Email",
        "value": "support@devfolio.net"
      },
      {
        "label": "Phone",
        "value": "+201030505992"
      },
      {
        "label": "Freelance",
        "value": "Available"
      }
    ]
  },
  "products": {
    "items": [
      {
        "name": "Web Development",
        "price": "$ 599.00",
        "href": "/product/web-development/",
        "slug": "web-development"
      },
      {
        "name": "Branding Marketing",
        "price": "$ 399.00",
        "href": "/product/branding-marketing/",
        "slug": "branding-marketing"
      }
    ]
  }
} as const;

export const navItems = [
  { id: 'about', label: 'About', href: '/' },
  { id: 'resume', label: 'Resume', href: '/resume' },
  { id: 'works', label: 'Projects', href: '/work' },
  { id: 'contact', label: 'Contact', href: '/contact' },
  { id: 'blog', label: 'Blog', href: '/blog' },
  // { id: 'products', label: 'Products', href: '/products' },
] as const;
