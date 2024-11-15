import { BadgePlus, ChartSpline, Clock3, ScrollText, Trophy, PencilLine } from "lucide-react";

import OptionCard from "./filter-option-card";


export default function OptionsRow() {

    return (
        <div className="flex flex-row flex-wrap justify-center gap-3 py-5 mt-5">
            <OptionCard color="primary" href="quizzes/wizard" icon={BadgePlus} text="Dodaj quiz" />
            <OptionCard color="default-800" href="/quizzes#my" icon={PencilLine} text="Moje" />
            <OptionCard color="default-800" href="#latest" icon={Clock3} text="Najnowsze" />
            <OptionCard color="default-800" href="#most-popular" icon={ChartSpline} text="Najpopularniejsze" />
            <OptionCard color="default-800" href="#highest-rated" icon={Trophy} text="Najwyżej oceniane" />
            <OptionCard color="default-800" href="/quizzes#all" icon={ScrollText} text="Wszystkie" />
      </div>
    )
}