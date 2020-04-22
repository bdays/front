import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MainPage from '../Pages/Main';
import ShowAllBdayPage from "../Pages/ShowAllBday";
import PagesHeaders from "../Pages/pagesHeader";
import ShowAllTemplatesPage from "../Pages/ShowAllTemplates";
import SchedulePage from "../Pages/Schedule";
import {getTheme} from "../Utils/themes";


export default function () {
    const [themeName, setThemeName] = useState(getTheme());

    return (
        <Router>
            <PagesHeaders themeName={themeName} setThemeName={setThemeName}/>
            <Switch>
                <Route path="/" exact>
                    <MainPage themeName={themeName}/>
                </Route>
                <Route path="/show-all-birthday">
                    <ShowAllBdayPage/>
                </Route>
                <Route path="/show-all-templates">
                    <ShowAllTemplatesPage themeName={themeName}/>
                </Route>
                <Route path="/schedule">
                    <SchedulePage/>
                </Route>
            </Switch>
        </Router>
    );
}
