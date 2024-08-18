export default function StripeTestCards(): JSX.Element {
    return (
      <div className="test-card-notice">
        Use any of the{" "}
        <a
          href="https://stripe.com/docs/testing#cards"
          target="_blank"
          rel="noopener noreferrer"
        >
          Stripe test cards
        </a>{" "}
        for this demo, e.g.{" "}
        <div className="inline whitespace-nowrap font-medium text-slate-600 dark:text-slate-400">
          4242<span className="w-1 inline-block"></span>4242<span className="w-1 inline-block"></span>4242<span className="w-1 inline-block"></span>4242
        </div>
        .
      </div>
    );
  }