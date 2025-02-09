import { withErrorBoundary, withSuspense } from '@extension/shared';
import packageJson from '../../../package.json';

const Popup = () => {
  const logo = 'popup/plutio-ext-logo-big.png';

  return (
    <div className="bg-background p-4">
      <div className="container mx-auto p-4 md:p-6 border rounded-xl shadow-lg">
        <div className="flex flex-col items-center text-center gap-4">
          <div>
            <img src={chrome.runtime.getURL(logo)} className="w-24" alt="Plutio Extension Unofficial" />
          </div>
          <div className="text-center">
            <h1 className="font-semibold text-base">Plutio Chrome Extension</h1>
            <div className="text-muted-foreground">(Unofficial)</div>
          </div>
          <nav className="flex flex-col justify-center items-center gap-2 text-sm">
            <a href="https://tally.so/r/wzG1a8" className="hover:text-primary">
              Submit a Feature Request / Feedback
            </a>
            <a href="#" className="hover:text-primary">
              About the extension
            </a>
            <a href="#" className="hover:text-primary">
              View Changelog
            </a>
          </nav>
          <div className="text-center text-xs text-muted-foreground">
            <p>v{packageJson.version}</p>
            <p>
              <bdi></bdi>y: mewben
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
