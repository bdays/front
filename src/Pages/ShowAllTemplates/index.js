import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import './style.scss';

import {
    calendarDeleteTemplate,
    calendarEditTemplate,
    calendarFetchListOfTemplates,
    calendarFetchTemplate, calendarFetchTemplateWithBday
} from "../../Reducers/templates";

import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ShowTemplate from "../../components/ShowTemplate";
import FormTemplate from "../../components/FormTemplate";
import SnackBar from "../../components/SnackBar";
import Spinner from "../../components/Spinners";
import ButtonGroup from "../../components/ButtonGroup";
import ListOfBdays from "../../components/ListOfBdays";
import {getCell} from "../../Utils/table";
import {isUserLoggedIn} from "../../Utils/user";
import {useHistory} from "react-router";
import {buttons, getButton, getButtonForButtonGroup} from "../../Utils/buttons";

export default function ({themeName}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const {payload, isLoading} = useSelector(state => state.templates.list, shallowEqual);
    const template = useSelector(state => state.templates.template, shallowEqual);
    const templateWithBday = useSelector(state => state.templates.templateWithBday, shallowEqual);

    const [showSimpleModal, setShowSimpleModal] = useState(false);//уточняющая модалка
    const [currentId, setCurrentId] = useState(null);//айди template, с которым в данный момент работает пользователь
    const [collapseTableOfTemplates, setCollapseTableOfTemplates] = useState(false);//уточняющая модалка
    const [showModal, setShowModal] = useState(false);//модалка для редактирования шаблона
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarContent, setSnackBarContent] = useState('');
    const [activeButton, setActiveButton] = useState(show);

    let buttonGroup = {
        className: 'div-button-group',
        buttons: [
            getButtonForButtonGroup(show,() => {
                setActiveButton(show);
            },(activeButton === show)),
            getButtonForButtonGroup(edit,() => {
                setShowModal(true);
            },(activeButton === edit)),
            getButtonForButtonGroup(del,() => {
                setShowSimpleModal(true);
            },(activeButton === del)),
            getButtonForButtonGroup(open,() => {
                setActiveButton(open);
            },((activeButton === open) || (activeButton === openTemplateWithBday))),
            getButtonForButtonGroup('×',() => {
                setCollapseTableOfTemplates(false);
            },false,'btn-close-button-group'),
        ]
    };

    if (!isUserLoggedIn()) {
        history.push("/");
    }

    useEffect(() => {
        dispatch(calendarFetchListOfTemplates());

    }, [dispatch]);

    const handleDelete = useCallback((id) => {
        dispatch(calendarDeleteTemplate(id)).then(() => {
            setCurrentId(null);
            setShowSimpleModal(false);
            dispatch(calendarFetchListOfTemplates());
            setCollapseTableOfTemplates(false);
        }).catch(() => {
            //обработать возможные ошибки
        })
    }, []);

    const handleGetTemplate = useCallback((id) => {
        dispatch(calendarFetchTemplate(id));
    }, []);

    const handleGetTemplateWithBday = useCallback((templateId, bdayId) => {
        dispatch(calendarFetchTemplateWithBday(templateId, bdayId));
    }, []);

    const handleEditTemplate = useCallback((id, data) => {
        dispatch(calendarEditTemplate(id, data)).then((resp) => {
            //выводим сообщение
            if (resp.ok) {
                setSnackBarContent('Template successfully edit');
            } else {
                setSnackBarContent('Error: ' + resp.statusText);
            }
            setShowSnackBar(true);
            setTimeout(() => setShowSnackBar(false), 3000);

            setCurrentId(null);
            setShowSimpleModal(false);
            dispatch(calendarFetchListOfTemplates());
            setCollapseTableOfTemplates(false);
        }).catch(() => {
            //обработать возможные ошибки
        })
    }, []);

    const tableOfTemplates = useMemo(() => (payload && !isLoading) ?
        getTableOfTemplate() : []
        , [payload, currentId, collapseTableOfTemplates]);

    const rightPanel = useMemo(() => (collapseTableOfTemplates) ?
        getRightPanel() : ''
        , [templateWithBday, template, currentId, collapseTableOfTemplates, activeButton]);

    function getTableOfTemplate() {
        return Object.values(payload).map((item, index) => {
            let action = (collapseTableOfTemplates) ? [] :
                [
                    getButton(buttons.SHOW,() => {
                        setActiveButton(show);
                        if (!collapseTableOfTemplates) (setCollapseTableOfTemplates(true));
                        if (currentId === item.id) {
                            setCollapseTableOfTemplates(!collapseTableOfTemplates);
                        }
                        setCurrentId(item.id);
                        handleGetTemplate(item.id);
                    }, 'ButtonShow' + index),
                    getButton(buttons.DELETE,() => {
                        setCurrentId(item.id);
                        setShowSimpleModal(true);
                    }, 'ButtonDelete' + index)
                ];
            return [
                getCell('td-sm', index + 1, null, ((currentId === item.id) && (collapseTableOfTemplates)) ? 'trActive' : ''),
                getCell('th-l', item.title, null, null, () => {
                    setActiveButton(show);
                    if (!collapseTableOfTemplates) {
                        setCollapseTableOfTemplates(true);
                    }
                    if (currentId === item.id) {
                        setCollapseTableOfTemplates(!collapseTableOfTemplates);
                    }
                    handleGetTemplate(item.id);
                    setCurrentId(item.id);

                }),
                getCell('td-action', action),
            ];
        })
    }

    function getRightPanel() {
        let tabContent;
        switch (activeButton) {
            case openTemplateWithBday:
                tabContent = (templateWithBday.isLoading ? <Spinner className='loader2'/> :
                    [<Button key="buttonBack" className='button-go' children='<< Back'
                             onClick={() => setActiveButton(open)}/>
                        , <ShowTemplate key='ShowBack' payload={templateWithBday.payload}/>]);
                break;
            case open:
                tabContent = (<ListOfBdays onClickGo={(id) => {
                    setActiveButton(openTemplateWithBday);
                    handleGetTemplateWithBday(currentId, id);
                }}/>);
                break;
            case show:
            default: /*получить шаблон и вывести его для просмотра*/
                tabContent = (template.isLoading ? <Spinner className='loader1'/> :
                    <ShowTemplate payload={template.payload}/>);
                break;
        }

        return (<div className='div-panel-right'>
            <ButtonGroup buttonGroup={buttonGroup}/>
            {tabContent}
        </div>);
    }

    return (
        <div>
            <Modal show={showModal} header='Edit template'
                   content={<FormTemplate edit={true} editData={template.payload} onSave=
                       {(data) => {
                           handleEditTemplate(currentId, data);
                           setShowModal(false);
                       }}
                   />} toClose={() => setShowModal(false)}/>

            <Modal show={showSimpleModal} header='Delete'
                   content={<>You sure?
                       <Button className='btn-modal-yes'
                               children='No'
                               onClick={() => setShowSimpleModal(false)}/>
                       <Button className='btn-modal-yes' children='Yes'
                               onClick={() => handleDelete(currentId)}/>
                   </>}
                   toClose={() => setShowSimpleModal(false)}/>
            <SnackBar show={showSnackBar} content={snackBarContent}/>

            <div className={(collapseTableOfTemplates) ? 'div-panel-left' : ''}>
                <div className={themeName+" month"}>
                    <ul>
                        <li className='monthName'><span
                            className="spanCalendar">Templates</span></li>
                    </ul>
                </div>
                <Table
                    classNameTable='table-ofTemplates'
                    header={[]} content={tableOfTemplates}
                    isLoading={isLoading}/>
            </div>
            {rightPanel}
        </div>
    );

}

const show = 'Show';
const edit = 'Edit';
const del = 'Delete';
const open = 'Open with Bday';
const openTemplateWithBday = 'openTemplateWithBday';