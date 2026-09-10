export const tabs = ['frontend', 'backend', 'fullstack'] as const;

export const tabTitles: Record<(typeof tabs)[number], string> = {
  frontend: 'Sr. Front-end',
  backend: 'Sr. Back-end',
  fullstack: 'Sr. Full Stack',
};

export const cvUrls: Record<(typeof tabs)[number], string> = {
  frontend: 'https://drive.google.com/file/d/13ANu9AhdRmIEmJAVPLMqbcugHwHzx5KU/view?usp=sharing',
  backend:
    'https://drive.google.com/file/d/1RV1u8EX74Z-asYbgWHKvY1eh88373pXcK8du/view?usp=drive_link',
  fullstack: 'https://drive.google.com/file/d/1ic8TvyK-OLQOm_ZWZkPHfNWfacAyHClp/view?usp=sharing',
};

export const coverLetterTexts: Record<(typeof tabs)[number], string> = {
  frontend: `Dear Hiring Manager,

I am writing to express my interest in the Senior Front-End Developer role. With 6+ years of experience building scalable, high-performance web applications, I specialize in React, TypeScript, and Next.js.

Throughout my career, I have delivered complex SaaS platforms, real-time products, fintech systems, gaming interfaces, and Web3 applications. My strengths include frontend architecture, state management, API integration, performance optimization, and creating clean, maintainable user interfaces that support both product quality and business goals.

I am a proactive engineer who takes ownership of delivery, communicates clearly with product and design teams, and consistently focuses on reliable results. I am looking for an opportunity where I can contribute to meaningful products and help raise the technical standard of the frontend team.

I would welcome the chance to discuss how my experience can support your goals. Thank you for your time and consideration.

Best regards,
Mels Vagharshyan`,

  backend: `Dear Hiring Manager,

I am writing to express my interest in the Senior Back-End Developer role. With 6+ years of experience designing and building scalable server-side systems, I specialize in Node.js, TypeScript, and modern backend architectures.

I have worked on complex SaaS platforms, real-time services, fintech systems, gaming backends, and Web3 products. My expertise includes API design, database modeling, authentication and authorization, system architecture, performance optimization, and building reliable, maintainable services that scale with business needs.

I am a proactive engineer who takes ownership of technical decisions, solves problems independently, and collaborates effectively with frontend, product, and DevOps teams. I am looking for an opportunity where I can strengthen backend reliability, improve system quality, and contribute to products that create real business impact.

I would be glad to discuss how my background can add value to your team. Thank you for reviewing my application.

Best regards,
Mels Vagharshyan`,

  fullstack: `Dear Hiring Manager,

I am writing to express my interest in the Senior Full-Stack Developer role. With 6+ years of experience building end-to-end web products, I work confidently across React, TypeScript, Next.js, and Node.js.

I have delivered complex SaaS platforms, real-time applications, fintech products, gaming systems, and Web3 solutions from interface to infrastructure. My expertise includes product architecture, frontend and backend development, API design, state management, performance optimization, and shipping clean, maintainable features that are ready for production.

I am a proactive engineer who takes ownership across the full delivery cycle, communicates well with cross-functional teams, and focuses on practical outcomes. I am looking for an opportunity where I can contribute across the stack, support product growth, and make a meaningful technical impact.

I would welcome the opportunity to discuss how my full-stack experience can benefit your team. Thank you for your time and consideration.

Best regards,
Mels Vagharshyan`,
};
