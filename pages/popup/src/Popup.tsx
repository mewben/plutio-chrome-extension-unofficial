import { withErrorBoundary, withSuspense } from '@extension/shared';
import packageJson from '../../../package.json';

const Popup = () => {
  const logo = 'popup/plutio-ext-logo-big.png';

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto rounded-xl border p-4 shadow-lg md:p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <img src={chrome.runtime.getURL(logo)} className="w-24" alt="Plutio Extension Unofficial" />
          </div>
          <div className="text-center">
            <h1 className="text-base font-semibold">Plutio Chrome Extension</h1>
            <div className="text-muted-foreground">(Unofficial)</div>
          </div>
          <nav className="flex flex-col items-center justify-center gap-2 text-sm">
            <a href="https://tally.so/r/wzG1a8" className="hover:text-primary" target="_blank" rel="noreferrer">
              Submit a Feature Request / Feedback
            </a>
            <a href="#TODO" className="hover:text-primary" target="_blank" rel="noreferrer">
              About the extension
            </a>
            <a
              href="https://github.com/mewben/plutio-chrome-extension-unofficial/releases"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary">
              View Changelog
            </a>
          </nav>
          <div className="text-center text-xs text-muted-foreground">
            <p>v{packageJson.version}</p>
            <p>by: mewben</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
