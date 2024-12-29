export default function Navbar() {
  return (
    <div className="bg-gray-100 border-[2px] border-black-300 absolute top-[1vh] left-[1vw] flex flex-col items-center justify-center gap-y-12">
      <h1>Navbar</h1>
      <nav>
        <a href="/input"><li>Input</li></a>
        <a href="/"><li>Home</li></a>
      </nav>
    </div>
  );
}