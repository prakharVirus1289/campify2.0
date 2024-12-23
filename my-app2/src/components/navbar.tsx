import {pathAtom} from "../atom/pathAtom"
import { useRecoilValue } from "recoil";

export default function Navbar() {

  const state_ = useRecoilValue(pathAtom);

  return (
    <div className="bg-gray-100 border-[2px] border-black-300 absolute top-[1vh] left-[1vw] flex flex-col items-center justify-center gap-y-12">
      <nav>
          <a href={element.path}><li>{element.name}</li></a>
      </nav>
    </div>
  );
}