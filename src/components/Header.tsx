import { useLocation } from 'preact-iso';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';
export function Header() {
	const { url } = useLocation();
	return (
		<header class="bg-background flex py-2 max-w-screen-xl max-w-container mx-auto w-full flex items-center justify-start gap-2 px-2">
			<nav class="flex items-start gap-2 justify-start">
					<a href="/">
						<Button variant="outline" className={url == '/' ? 'bg-primary hover:bg-primary' : "bg-background hover:bg-background"}>
							Market
						</Button>
					</a>
					<a href="/portfolio">
						<Button variant="outline" className={url == '/portfolio' ? 'bg-primary hover:bg-primary' : "bg-background "}>
							Portfolio
						</Button>
					</a>
					<ModeToggle />
			</nav>
		</header>
	);
}
