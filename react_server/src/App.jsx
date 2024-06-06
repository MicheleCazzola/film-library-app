import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react'
import './App.css'
import NewFilm from "./components/NewFilm"
import NavHeader from './components/NavHeader';
import MainContent from './components/MainContent';
import {FilmLibrary, Film} from './FilmModel.mjs'
import { Outlet, Route, Routes } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import SideFilters from './components/SideFilters';
import FilmForm from './components/FilmForm';
import ErrorComponent from './components/ErrorComponent';
import LoginForm from './components/LoginForm';
import API from './API.mjs';

const filmLibrary = new FilmLibrary();

function App() {
	const URLs = filmLibrary.filterURLs;
    const conditions = filmLibrary.filterConditions;
	const filters = Object.keys(conditions);

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(false)

	useEffect(() => {
		const getUserInfo = async () => {
			const user = await API.getUserInfo();
			setUser(user);
			//user ? setIsLoggedIn(true) : setIsLoggedIn(false);
		}
		if (isLoggedIn) getUserInfo()
	}, [isLoggedIn]);

	return (
		<Routes>
			<Route path='/login' element={
				!isLoggedIn && <LoginForm isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
			}></Route>
			<Route path="/" element={
				isLoggedIn && <>
					<NavHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={user ? user.name: "No user"}></NavHeader>
					<Container fluid className="d-flex flex-column flex-grow-1">
							<Row className="min-vh-100 flex-grow-1">
								<SideFilters filters={filters} URLs={URLs} ></SideFilters>
								<Outlet />
							</Row>
					</Container>
				</>
			}>
				<Route index element={
					isLoggedIn && <>
						<MainContent urlDict={URLs} conditions={conditions} />	
						<NewFilm></NewFilm>
					</>
				}></Route>
				<Route path='filter/:filterId' element={
					<>
						<MainContent urlDict={URLs} conditions={conditions} />	
						<NewFilm></NewFilm>
					</>
				}>
				</Route>
				<Route path='add' element={
					<>
						<FilmForm buttonName={"Add"}>
						</FilmForm>
					</>
				}></Route>
				<Route path='edit/:filmId' element={
					<>
						<FilmForm buttonName={"Update"} >
						</FilmForm>
					</>
				}></Route>
				<Route path="*" element={
					<>
						<ErrorComponent></ErrorComponent>
					</>
				}></Route>
			</Route>
		</Routes>
	)
}

export default App
