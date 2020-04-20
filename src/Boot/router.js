import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MainPage from '../Pages/Main';
import ShowAllBdayPage from "../Pages/ShowAllBday";
import PagesHeaders from "../Pages/pagesHeader";
import ShowAllTemplatesPage from "../Pages/ShowAllTemplates";
import SchedulePage from "../Pages/Schedule";

export default function () {
    return (
        <Router>
            <PagesHeaders/>
            <Switch>
                <Route path="/" exact>
                    <MainPage/>
                </Route>
                <Route path="/show-all-birthday">
                    <ShowAllBdayPage/>
                </Route>
                <Route path="/show-all-templates">
                    <ShowAllTemplatesPage/>
                </Route>
                <Route path="/schedule">
                    <SchedulePage/>
                </Route>
            </Switch>
        </Router>
    );
}
