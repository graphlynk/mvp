import { Link } from "wouter";
import { SiLinkedin } from "react-icons/si";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/graphlynk",
    icon: SiLinkedin,
  }
];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 py-12 px-8 border-t border-border" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Left side - Address and Copyright */}
          <div className="text-left space-y-6">
            <div className="space-y-1">
              <p className="text-sm text-slate-600 dark:text-slate-300">New York, NY</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">hello@graphlynk.com</p>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400" data-testid="text-copyright">
              © {new Date().getFullYear()} Graphlynk
            </p>
          </div>

          {/* Right side - Links and Social */}
          <div className="flex items-start gap-12">
            {/* Footer Links */}
            <div className="flex items-center gap-8" data-testid="footer-links-container">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                  data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4" data-testid="social-links-container">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                    aria-label={`Follow us on ${social.name}`}
                    data-testid={`link-social-${social.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
