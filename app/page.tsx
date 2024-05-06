"use client";

import { Button } from "@/components/ui/button";
import Checkbox from "@/components/Checkbox";
import Image from "next/image";
import { useState } from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa";

export default function Home() {
	const [length, setLength] = useState<number>(0);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [password, setPassword] = useState("Ahfd3$%");
	const [copied, setCopied] = useState(false);
	const [includeUpperCase, setIncludeUpperCase] = useState(false);
	const [includeLowerCase, setIncludeLowerCase] = useState(false);
	const [includeNumbers, setIncludeNumbers] = useState(false);
	const [includeSymbols, setIncludeSymbols] = useState(false);

	const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
	const numbers = "0123456789";
	const symbols = "!@#$%^&*_+";

	const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLength(parseInt(event.target.value));
	};

	const calculatePasswordStrength = (password: string) => {
		let strength = 0;

		// Add points for length
		strength += Math.min(password.length, 10) * 2;

		// Add points for variety of characters
		const regexList = [
			/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]\\|:;'"<>,./?])/,
		];
		regexList.forEach((regex) => {
			if (regex.test(password)) {
				strength += 20;
			}
		});

		// Adjust strength based on unique characters
		const uniqueCharacters = new Set(password.split("")).size;
		strength += Math.min(uniqueCharacters, 5) * 5;

		// Normalize strength to a range between 0 and 100
		return Math.min(Math.round((strength / 60) * 100), 100);
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(password);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const generatePassword = (length: number) => {
		let characters = "";
		if (includeUpperCase) characters += uppercaseLetters;
		if (includeLowerCase) characters += lowercaseLetters;
		if (includeNumbers) characters += numbers;
		if (includeSymbols) characters += symbols;

		if (characters === "") {
			alert("Please select at least one character set.");
			return;
		}
		let generatedPassword = "";
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			generatedPassword += characters[randomIndex];
		}
		setPassword(generatedPassword);
		setPasswordStrength(calculatePasswordStrength(generatedPassword));
	};
	return (
		<div className="bg-[#000] min-h-screen py-12">
			<h1 className="text-[#807c92] text-center text-4xl mb-8">
				Password Generator
			</h1>
			<div className="w-[80%] mx-auto grid gap-y-8">
				<div className="generated_password bg-[#23222a] flex items-center justify-between p-8">
					<span className="text-2xl text-[#E7E6EB]">{password}</span>
					{copied ? (
						<FaCheck fill="#A3FFA3" />
					) : (
						<Image
							src={"/icon-copy.svg"}
							alt=""
							width={20}
							height={20}
							onClick={copyToClipboard}
						/>
					)}
				</div>

				<div className="generator__container bg-[#23222a] text-white p-8">
					<input
						type="range"
						min={0}
						max={10}
						value={length}
						onChange={handleSliderChange}
						className="slider"
					/>
					<p>Current value: {length}</p>

					<div className="my-8 grid gap-y-8">
						<div className="flex items-center gap-x-4">
							<Checkbox
								id="upperCase"
								checked={includeUpperCase}
								onChange={(isChecked) => setIncludeUpperCase(isChecked)}
							/>{" "}
							<label
								htmlFor="upperCase"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Include Uppercase Letters
							</label>
						</div>

						<div className="flex items-center gap-x-4">
							<Checkbox
								id="lowerCase"
								checked={includeLowerCase}
								onChange={(isChecked) => setIncludeLowerCase(isChecked)}
							/>
							<label
								htmlFor="lowerCase"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Include Lowercase Letters
							</label>
						</div>

						<div className="flex items-center gap-x-4">
							<Checkbox
								id="numbers"
								checked={includeNumbers}
								onChange={(isChecked) => setIncludeNumbers(isChecked)}
							/>
							<label
								htmlFor="numbers"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Include Numbers
							</label>
						</div>

						<div className="flex items-center gap-x-4">
							<Checkbox
								id="symbols"
								checked={includeSymbols}
								onChange={(isChecked) => setIncludeSymbols(isChecked)}
							/>
							<label
								htmlFor="symbols"
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Include Symbols
							</label>
						</div>
					</div>

					<div>Password Strength: {passwordStrength}%</div>
					{/* You can style this however you like, maybe use a progress bar */}
					<progress value={passwordStrength} max="100"></progress>

					<Button
						className="bg-[#A3FFA3] text-black hover:text-[#A3FFA3] hover:border hover:hover-[#A3FFA3] flex items-center gap-x-4"
						onClick={() => generatePassword(length)}
					>
						Generate Password
						<FaArrowRight className="fill-white" />
					</Button>
				</div>
			</div>
		</div>
	);
}
