import React, {useEffect, useState} from 'react';

import './style.scss';

import {Slack_Block_Kit_Builder_URL} from "../../Utils/constants";

import Button from "../Button";
import TextArea from "../TextArea";
import Input from "../Input";
import ErrorBlock from "../Error";
import {compareObj} from "../../Utils/objects";
import {blocksValidation, isValidationSuccessful, titleValidation} from "../../Utils/validation";
import ButtonHelp from "../ButtonHelp";

function FormTemplate({editData, onSave, edit}) {//если edit=true - Значит форма открыта для редактирования
    const [data, setData] = useState(editData);
    const [err, setErr] = useState({
        show: false,
        title: '',
        text: '',
        blocks: '',
        attachments: '',
    });
    const [blocks, setBlocks] = useState((edit)?JSON.stringify(data.blocks, null, "  "):'');

    useEffect(() => {
        window.addEventListener("keydown", escFunction, {once: true, capture: false});
        return () => {
            window.removeEventListener("keydown", escFunction, {once: true, capture: false});
        };
    });

    function escFunction(e) {
        if (e.keyCode === 13) {
            handleSave();
        }
    }

    function handleSave() {
        setErr(formTemplateValidation(data, blocks, setData));
        if (!formTemplateValidation(data, blocks, setData).show) {
            let per = JSON.parse(blocks);
            if (typeof per['blocks'] === "undefined") {//если поля blocks нет в объекте
                per = {"blocks": per};
            }
            onSave({...data, blocks: [].concat(per.blocks)});
        }
    }

    function clickHelp(e) {
        e.preventDefault();
        const url = new URL(Slack_Block_Kit_Builder_URL);
        url.searchParams.set("mode", "message");
        url.searchParams.set("blocks", (edit) ? blocks : '[]');
        window.open(url.toString());
    }

    return (
        <>
            <div className='form-addTemplate'>
                <label>Title<ErrorBlock content={err.title}/>
                    <Input
                        placeholder='Enter template name..'
                        value={data.title}
                        handleChange={(e) => {
                            setData({...data, title: e.target.value});
                        }}/>
                </label>

                <label>Text<ErrorBlock content={err.text}/>
                    <TextArea
                        placeholder='Enter text..'
                        value={data.text}
                        handleChange={(e) => {
                            setData({...data, text: e.target.value});
                        }}/>
                </label>
                <label>Blocks
                </label>
                <ButtonHelp onClick={clickHelp} children='Open SLACK'
                            tooltipText={edit ? 'View template with Slack Block Kit Builder' : 'Open Slack Block Kit Builder'}/>
                <ErrorBlock content={err.blocks}/> {/*проверять на json*/}

                <TextArea
                    className='textarea-forJSON'
                    placeholder='Insert JSON from "SLACK Block Kit Builder"'
                    value={blocks}
                    handleChange={(e) => {
                        setBlocks(JSON.parse(JSON.stringify(e.target.value, null, "  ")));
                    }}/>
            </div>
            <Button onClick={handleSave}
                    disabled={(compareObj(editData, data) && (edit) && (blocks === JSON.stringify(editData.blocks, null, "  "))) ? ('disabled') : ('')}
                    className="btn-save">Save</Button></>
    );
}

export default FormTemplate;

function formTemplateValidation(data, blocks, setData) {
    let err = {
        show: false,
        title: '',
        text: '',
        blocks: '',
        attachments: '',
    };

    err.title = titleValidation(data.title);
    err.text = titleValidation(data.text);

    const blocksValid = blocksValidation(blocks);

    err.blocks = blocksValid.err;
    setData({...data, blocks: [].concat(blocksValid.blocks)});

    err.show = !isValidationSuccessful(err);
    return err;
}

