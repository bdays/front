import React, {} from "react";
import './style.scss';
import ButtonHelp from "../ButtonHelp";
import TextArea from "../TextArea";
import {Slack_Block_Kit_Builder_URL} from "../../Utils/constants";
import ErrorBlock from "../Error";

function ShowTemplate({payload}) {
    try {
        return (<div className='div-showTemplate'>
            <p><b>TITLE:</b></p>
            <blockquote>
                <p>{payload.title}</p>
            </blockquote>
            <p><b>TEXT:</b></p>
            <blockquote>
                <p>{payload.text}</p>
            </blockquote>
            <p><b>BLOCKS:</b>
                <ButtonHelp onClick={() => {
                    const url = new URL(Slack_Block_Kit_Builder_URL);
                    url.searchParams.set("mode", "message");
                    url.searchParams.set("blocks", JSON.stringify(payload.blocks));
                    window.open(url.toString());
                }} children='Open in SLACK'
                            tooltipText='View template with Slack Block Kit Builder'/>
            </p>
            <TextArea
                className='textarea-forJSON'
                value={JSON.stringify(payload.blocks, null, "  ")}
                readOnly={true}
            />

        </div>);
    } catch (e) {
        return (<div className='div-showTemplate'><ErrorBlock content={'Data display error'}/></div>);
    }

}

export default ShowTemplate;
