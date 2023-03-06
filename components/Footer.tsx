import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <button className="bg-violet-400 text-white text-lg rounded-md px-3 py-1.5 m-5 hover:bg-violet-500 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300" onClick={() => location.href = 'https://worldcoin.org/blog'}>Read more about Proof-of-Personhood</button>
      <p className='mb-5 text-sm text-center text-slate-400'> Built by <Link className='text-slate-500 hover:text-slate-800' href="https://twitter.com/0xPenryn">0xPenryn</Link> and <Link className='text-slate-500 hover:text-slate-800' href="https://hyperflu.id">Hyperfluid</Link>.</p>
    </footer>
  );
}
