import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-8 pt-4 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <img src="/logo.png" className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Kubeflow</span>
            </div>
            <div className="h-4 w-px bg-border/50" />
            <div className="flex items-center">
                <img src="/gsoc.png" className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium">Google Summer of Code</span>
            </div>
          </div>

          <div className="text-center md:text-left text-sm text-muted-foreground">
            <p>PoC for Kubeflow GSoC Project 12</p>
          </div>

          <div className="flex items-center space-x-3">
          <a
              href="https://github.com/KacemMathlouthi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/kacem-mathlouthi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:kacem.mathlouthi@insat.ucar.tn"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

