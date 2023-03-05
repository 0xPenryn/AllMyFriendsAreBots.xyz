import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <button className="bg-violet-400 text-white text-lg rounded-md px-5 py-1.5 m-5" onClick={() => location.href = 'https://worldcoin.org/blog'}>Read more about Proof-of-Personhood</button>
    </footer>
  );
}
