import Image from 'next/image'

import quiz_home from "../../public/images/quiz_home.jpg"

import QuizzesRow from "@/components/quizzes-row";
import OptionsRow from '@/components/options-row';



export default function Page() {


    return (
        <div >
            <div className="relative h-[30svh] w-full rounded-xl overflow-hidden flex items-center justify-center">
                <Image 
                    alt="" 
                    src={quiz_home} 
                    className="absolute inset-0 object-cover w-full h-full blur-sm" 
                />

                <div className="absolute inset-0 bg-black opacity-40"></div>

                <h1 className="relative z-10 text-white text-4xl font-semibold text-center italic">
                    Odkrywaj, ucz się i spędzaj miło czas
                </h1>
            </div>

            <OptionsRow />

            <QuizzesRow option="highest-rated" title="Najwyżej oceniane" />
            <QuizzesRow option="most-popular" title="Najpopularniejsze" />
            <QuizzesRow option="latest" title="Najnowsze" />
            {/* <QuizzesRow option="my" title="Moje" /> */}
            {/* <QuizzesRow title="Wszystkie" /> */}
        </div>
    )
}