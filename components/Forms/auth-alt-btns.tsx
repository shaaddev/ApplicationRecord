import { Google, Github } from "@/lib/Logos";
import { Button } from "../ui/button";

const altBtns = [
  {
    name: 'Continue with Google',
    icon: <Google className="ml-2"/>,
    clickable: null
  },
  {
    name: 'Continue with Github',
    icon: <Github className="ml-2"/>,
    clickable: null
  }
]

export function AuthAltBtns() {
  return(
    <div className="w-full ">
      <hr />

      {altBtns.map((a, index) => (
        <Button key={index} variant="outline" className="mt-5 w-full ">
          {a.name} {a.icon}
        </Button>
      ))}
    </div>
  )
}