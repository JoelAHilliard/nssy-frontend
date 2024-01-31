import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import Portfolio from './pages/Portfolio/index.js';
import './style.css';
import { ThemeProvider } from "@/components/theme-provider"
import { getMarketData, loadPortfolios, portfolio_data } from './preact-service.js';
import { effect } from '@preact/signals';
import { useRef, useEffect } from 'preact/hooks';
import CryptoBreakdown from './components/crypto-breakdown.js';
export function intToString(num, fixed) {
	if (num === null) { return null; } 
	if (num === 0) { return '0'; } 
	fixed = (!fixed || fixed < 0) ? 0 : fixed; 
	var b = (num).toPrecision(2).split("e"),
		k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), 
		c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3) ).toFixed(1 + fixed), 
		d = c < 0 ? c : Math.abs(c), 
		e = d + ['', 'K', 'M', 'B', 'T'][k]; 
	return e;
}
export function App() {

	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function() {
		  navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		  }, function(err) {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err);
		  });
		});
	  }
	  
	useEffect(()=>{
		getMarketData();
	},[])

	useEffect(()=>{
		localStorage.setItem("portfolios",JSON.stringify(portfolio_data.value))
	},[portfolio_data.value])
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div class="flex flex-col flex-1">
				<LocationProvider >
					<div class="bg-background min-h-screen flex flex-col">
						<Header />

						<Router>
							<Route path="/" component={Home} />
							<Route path="/portfolio" component={Portfolio} />
							<Route default path="*" component={CryptoBreakdown} />
						</Router>
					</div>

				</LocationProvider>
			</div>
		</ThemeProvider>
		
	);
}

render(<App />, document.getElementById('app'));
