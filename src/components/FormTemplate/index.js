import React, {useEffect, useState} from 'react';
import './style.scss'
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
    const [blocks, setBlocks] = useState(JSON.stringify(data.blocks,null,"  "));

    function clickHelp(e) {
        e.preventDefault();
        window.open('https://api.slack.com/tools/block-kit-builder');
    }

    return (
        <>
            <form className='form-addTemplate'>
                <label>Title<ErrorBlock content={err.title}/>
                    <Input
                        placeholder='Enter template name..'
                        value={data.title}
                        handleChange={(e) => {
                            setData({...data, title: e.target.value});
                            //setErr(validation({...data, title: e.target.value}, blocks, setData));
                        }}/>
                </label>

                <label>Text<ErrorBlock content={err.text}/>
                    <TextArea
                        placeholder='Enter text..'
                        value={data.text}
                        handleChange={(e) => {
                            setData({...data, text: e.target.value});
                            //setErr(validation({...data, text: e.target.value}, blocks, setData));
                        }}/>
                </label>
                <label>Blocks <ButtonHelp onClick={clickHelp} children='Open SLACK'
                                          tooltipText='View template with Slack Block Kit Builder'/>
                    <ErrorBlock content={err.blocks}/> {/*проверять на json*/}
                    <TextArea
                        className='textarea-forJSON'
                        placeholder='Insert JSON from "SLACK Block Kit Builder"'
                        value={blocks}
                        handleChange={(e) => {
                            setBlocks(JSON.parse(JSON.stringify(e.target.value,null,"\u0009")));
                        }}/>
                </label>
            </form>
            <Button onClick={() => {
                setErr(formTemplateValidation(data, blocks, setData));
                if (!formTemplateValidation(data, blocks, setData).show) {
                    let per = JSON.parse(blocks);
                    if (typeof per['blocks'] === "undefined") {//если поля blocks нет в объекте
                        per = {"blocks": per};
                    }
                    onSave({...data, blocks: [].concat(per.blocks)});
                }
            }}
                    disabled={(compareObj(editData, data) && (edit) && (blocks === JSON.stringify(editData.blocks,null,"  "))) ? ('disabled') : ('')}
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

