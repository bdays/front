import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import './style.scss';
import FormAuthorization from "../../components/FormAuthorization";

function AuthorizationPage() {
    return <div><FormAuthorization/></div>
}

export default AuthorizationPage;

