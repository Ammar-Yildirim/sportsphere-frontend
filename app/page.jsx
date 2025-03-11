import Link from "next/link";
import SportSphereLogo from "./ui/sportsphere-logo";
import { co, poppins } from "./ui/fonts";
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <header>
        <nav className="h-16 flex justify-between items-center px-5 md:px-15 md:h-20">
          <SportSphereLogo />
          <div className="flex items-center font-medium space-x-3.5">
            <Link href="/auth/login">
              <button className="bg-gray-200 font-semibold px-4 py-2 rounded-md cursor-pointer">
                Sign in
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md cursor-pointer">
                Register
              </button>
            </Link>
          </div>
        </nav>
      </header>
      <main className={`${poppins.className}`}>
        <section
          className=" bg-cover bg-center w-full h-[60vh] md:h-[calc(100vh-80px)]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1)), url('/hero.jpg')`,
          }}
        >
          <div className="px-10 h-full flex flex-col justify-center items-start font-bold text-white">
            <h1
              className={`${poppins.className} text-6xl md:text-7xl lg:text-8xl`}
            >
              Find Games
            </h1>
            <h2 className={`${co.className} text-4xl md:text-5xl lg:text-6xl`}>
              PLAY ANYTIME
            </h2>
            <h2 className={`${co.className} text-4xl md:text-5xl lg:text-6xl`}>
              ANY SPORT
            </h2>
          </div>
        </section>
        <section className={`${poppins.className} px-10 py-20 space-y-5`}>
          <h1 className={`font-bold text-4xl md:text-5xl`}>
            Welcome to SportSphere
          </h1>
          <p className="font-light text-xl md:text-2xl">
            At Sportsphere, we make sports easy and accessible. Wherever you are, your next game is only a click away from you. Whether for fun or competition, we believe in fair play, teamwork, and the joy of the
            game. Book your spot and make every match count!
          </p>

          <h2 className="flex text-2xl">
            👉
            <Link href="/auth/register">
              <p className="hover:underline">Join Us Now!</p>
            </Link>
          </h2>
        </section>
        <section className="bg-gray-200 p-10">
          <h1 className="text-4xl font-semibold text-center">
            SportSphere is built on 3 core principles
          </h1>
          <div className="grid grid-cols-1 mt-8 md:grid-cols-3">
            <div className="border-t-[14px] pt-6 border-white">
              <div className="p-4">
                <h2 className="text-3xl font-semibold">Accessibility</h2>
                <p className="text-lg font-light">
                We believe that logistics should never be a barrier to enjoying sports. Whether it's finding a nearby game, organizing a match, or discovering new opportunities to play, Sportsphere makes it effortless. No more struggling with schedules or searching for teammates—every game should be just a click away.
                </p>
              </div>
            </div>
            <div className="border-t-[14px] pt-6 border-red-500">
              <div className="p-4">
                <h2 className="text-3xl font-semibold">Social Integration</h2>
                <p className="text-lg font-light">
                Sports are more than just physical activity; they are a universal language that brings people together. Whether you've moved to a new country, want to try a different sport, or simply expand your social circle, playing with others helps foster connections. Team-based activities create a sense of belonging, making it easier to build friendships and strengthen communities.
                </p>
              </div>
            </div>
            <div className="border-t-[14px] pt-6 border-blue-500">
              <div className="p-4">
                <h2 className="text-3xl font-semibold">Wellbeing</h2>
                <p className="text-lg font-light">
                Engaging in sports is one of the best ways to maintain both physical and mental well-being. Regular physical activity has been proven to improve cardiovascular health, boost energy levels, and reduce stress. Beyond the physical benefits, sports also enhance mental resilience, promote discipline, and contribute to overall happiness. At Sportsphere, we encourage an active lifestyle to help you feel your best every day.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={`my-20 px-10 grid grid-cols-1 gap-16 text-center md:grid-cols-3`}>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold ">Find your sport.</h1>
            <Image
              src="/field.png"
              alt="discover game image"
              width={300}
              height={300}
            ></Image>
            <p className="max-w-5/6">
              Explore any sport in one platform and discover the perfect game
              for you
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold ">Book your spot.</h1>
            <Image
              src="/point2.png"
              alt="book spot image"
              width={300}
              height={300}
            ></Image>
            <p className="max-w-5/6">
              Reserve your place and prepare for action
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold ">Play with passion.</h1>
            <Image
              src="/fairplay.png"
              alt="fairplay image"
              width={300}
              height={300}
            ></Image>
            <p className="max-w-5/6">
              Make new friends, enjoy the game, and compete with spirit
            </p>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 p-2 text-white text-center">
        2025 © SportSphere, Ltd. All rights reserved
      </footer>
    </>
  );
}
