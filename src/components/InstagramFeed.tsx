import { useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';

const InstagramFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Process embeds when script loads
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-center mb-8">
        <a
          href="https://www.instagram.com/fitmomcapetown/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors text-lg"
        >
          <Instagram size={24} />
          <span>@fitmomcapetown</span>
        </a>
      </div>

      <div 
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto"
      >
        <blockquote
          className="instagram-media"
          data-instgrm-permalink="https://www.instagram.com/fitmomcapetown/"
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: '0',
            borderRadius: '3px',
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: '1px',
            maxWidth: '540px',
            minWidth: '326px',
            padding: '0',
            width: '99.375%'
          }}
        />
      </div>
    </div>
  );
};

export default InstagramFeed;

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}