import { Card } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { BadgePlus, ChartSpline, Clock3, Star } from "lucide-react";


export default function OptionsRow() {

    return (
        <div className="flex flex-row justify-center gap-4 py-5 mt-5">
            <Card className="w-[12rem] h-[10rem] hover:scale-110">
                <Link className="p-5 text-default-900 flex flex-col h-full cursor-pointer hover:bg-default-100" href="quizzes/wizard">
                    <BadgePlus className="w-full h-full text-primary-500" />
                    <h3 className="text-primary-500 font-semibold">Dodaj quiz</h3>
                </Link>
            </Card>
            <Card className="w-[12rem] h-[10rem] hover:scale-110">
                <Link className="p-5 text-default-900 flex flex-col h-full cursor-pointer hover:bg-default-100" href="#latest">
                    <Clock3 className="w-full h-full" />
                    <h3 className="font-semibold">Najnowsze</h3>
                </Link>
            </Card>
            <Card className="w-[12rem] h-[10rem] hover:scale-110">
                <Link className="p-5 text-default-900 flex flex-col h-full cursor-pointer hover:bg-default-100" href="#most-popular">
                    <ChartSpline className="w-full h-full" />
                    <h3 className="font-semibold">Najpopularniejsze</h3>
                </Link>
            </Card>
            <Card className="w-[12rem] h-[10rem] hover:scale-110">
                <Link className="p-5 text-default-900 flex flex-col h-full cursor-pointer hover:bg-default-100" href="#highest-rated">
                    <Star className="w-full h-full" />
                    <h3 className="font-semibold">Najwyżej oceniane</h3>
                </Link>
            </Card>
        </div>
    )
}