"use client"
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-primary">404 - Strona nie znaleziona</h1>
      <p className="mt-4 text-lg text-default-600">Nie mogliśmy znaleźć strony, której szukasz.</p>
      <Link className="mt-6 text-blue-500 underline" href="/home">
        Wróć na stronę główną
      </Link>
    </div>
  );
}