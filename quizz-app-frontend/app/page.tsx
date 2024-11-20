"use client"
import { Button } from '@nextui-org/button';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  return (
    <div className=" w-full h-full">
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          priority 
          alt="Tło aplikacji QuizzApp" 
          className="object-cover w-full h-full" 
          layout="fill" 
          src="/images/background.jpg" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 z-5"/>
      </div>
      <div className="relative h-full w-full flex flex-col gap-16 justify-center items-center z-10">
        <h1 className="text-7xl text-primary text-center font-semibold">
          Witaj w QuizzApp
        </h1>
        <h2 className="text-white text-2xl text-center">
          W <span className="text-primary font-medium">QuizzApp</span> możesz tworzyć nowe quizy oraz rozwiązywać już istniejące, a przy tym rywalizować z innymi użytkownikami.
        </h2>
        <h3 className="text-white text-2xl text-center">
          Nie zwlekaj i dołącz do naszej społeczności już dziś.
        </h3>
        <div className='flex sm:flex-row flex-col justify-center items-center sm:gap-8 gap-4'>
          <Button className='px-16 py-8 text-lg' color='primary' radius='full' size='lg' variant='shadow' onClick={() => router.push('/login')}>
            Zaloguj się
          </Button>
          <p className='text-lg text-white'>Lub</p>
          <Button className='px-16 py-8 text-lg' color='primary' radius='full' size='lg' variant='shadow' onClick={() => router.push('/register')}>
            Zarejestruj się
          </Button>
        </div>
      </div>
    </div>
  );
}
