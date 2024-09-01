import { Google, Github } from "@/lib/Logos";
import { Button } from "../ui/button";
import { signInWithGitHubAction, signInWithGoogleAction, signInAnonymouslyAction } from "./authActions";

const altBtns = [
  {
    name: 'Continue with Google',
    icon: <Google className="ml-2"/>,
    action: signInWithGoogleAction,
  },
  {
    name: 'Continue with Github',
    icon: <Github className="ml-2"/>,
    action: signInWithGitHubAction,
  },
  {
    name: 'Try as a Guest', 
    icon: null,
    action: signInAnonymouslyAction,
  }
]

export function AuthAltBtns() {
  return(
    <div className="w-full ">
      <hr />

      {altBtns.map((a, index) => (
        <form key={index} action={a.action}>
          <Button variant="outline" className="mt-5 w-full ">
            {a.name} {a.icon}
          </Button>
        </form>
      ))}
    </div>
  )
}