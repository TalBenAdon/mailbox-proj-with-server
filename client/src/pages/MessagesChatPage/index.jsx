import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { BsFillStarFill } from "react-icons/bs";
import { AiFillPrinter } from "react-icons/ai";
import { BiSolidTrashAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlinePaperClip } from "react-icons/ai";
import { FaFileImage } from "react-icons/fa6";
import { IoPaperPlane } from "react-icons/io5";
import ButtonsHeaderFooter from '../../components/ButtonsHeaderFooter';
import OpenedMessage from '../../components/OpenedMessage';
import MessageInputBox from '../../components/MessageInputBox';
import defaultImg from '../../assets/defaultImg.jpg'
import MessageButton from '../../components/MessageButton';
import FileUpload from '../../components/FileUpload';
import dateTimeFormatting from '../../Helpers/dateTimeFormatting'
import ConversationsTitle from '../../components/ConversationTitle';
import DropDownOptions from '../../components/DropDownOptions';
import { useParams } from 'react-router-dom';
import apiCall from '../../Helpers/api';
import { useLocation } from 'react-router-dom/dist/umd/react-router-dom.development';

export default function MessagesChatPage() {
    const { chatId } = useParams()
    const [messagesList, setMessagesList] = useState([])
    const [title, setTitle] = useState('')
    const location = useLocation()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const title = await apiCall({ method: "GET", url: `chat/subject/${chatId}` })
                const subject = title.subject
                setTitle(subject)

            } catch (error) {
                console.error(error);
            }
        }
        fetchData()
    }, [chatId])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiCall({ method: "GET", url: `chat/${chatId}/messages` })
                response.forEach(message => {
                    message.hour = dateTimeFormatting.formatTime(message.date)
                    message.date = dateTimeFormatting.translateDateToString(message.date)
                    if (message.senderId === '660e9b7ffd6968d3bfa0ce16') {
                        message.you = true
                    }
                });

                setMessagesList(response)
            } catch (error) {
                console.error(error);
            }
        }
        fetchData()
    }, [chatId])


    const [msgForm, setMsgForm] = useState({})

    const createMsg = () => {
        const newMsg = {
            sender: "Tal Ben Adon",
            content: msgForm.msgBox,
            date: dateTimeFormatting.translateDateToString(new Date()),
            hour: dateTimeFormatting.formatTime(new Date()),
            you: true
        }
        return newMsg
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const newMsg = createMsg()
        const msgToServer = { ...newMsg }
        delete msgToServer.hour
        msgToServer.date = new Date()
        const response = await apiCall({ method: "PUT", url: `chat/${chatId}/messages`, body: msgToServer })
        setMessagesList((prev) => ([...prev, newMsg]))
        console.log(msgForm);
        setMsgForm(prevForm => ({
            ...prevForm,
            msgBox: ''
        }));
    }
    const handleOnChange = (event) => {
        const { name, value } = event.target
        setMsgForm((prev) => ({ ...prev, [name]: value }))
    }

    const headerIconData = [
        { icon: <BsFillStarFill /> },
        { icon: <AiFillPrinter /> },
        { icon: <BiSolidTrashAlt /> },
    ]
    const footerIconData = [{ type: 'image' }, { type: 'file' }]
    const footerDeleteOptionsData = [{ icon: <BiSolidTrashAlt /> }, { icon: <BsThreeDotsVertical /> }]
    return (
        <div className={styles.MessagesChatPageContainer}>

            <div className={styles.pageHeader}>
                Special offers
                <div className={styles.iconsContainer}>
                    {headerIconData.map((data, index) => {
                        return <ButtonsHeaderFooter key={index} icon={data.icon} />
                    })}
                    <DropDownOptions />
                </div>
            </div>
            <hr className={styles.topHr} />
            <ConversationsTitle title={title} />
            <div className={styles.messages}>
                {messagesList.map((data, index) => {
                    return <><OpenedMessage key={index} avatarImg={data.avatar} userName={data.sender} msg={data.content} hour={data.hour} date={data.date} you={data.you} />
                        <hr className={styles.msgsHr} />
                    </>

                })}
            </div>
            <form onSubmit={handleSubmit}>
                <MessageInputBox onChange={handleOnChange} value={msgForm['msgBox']} name={'msgBox'} />
                <div className={styles.footerContainer}>
                    <div className={styles.leftsideFooter}>
                        {footerIconData.map((data) => {
                            return <FileUpload key={data.type} type={data.type} />
                        })}
                    </div>
                    <div className={styles.rightsideFooter}>
                        {footerDeleteOptionsData.map((data, index) => {
                            return <ButtonsHeaderFooter key={index} icon={data.icon} />
                        })}
                        <MessageButton icon={<IoPaperPlane />} title={'Send'} wrap={true} type={'submit'} />
                    </div>
                </div>
            </form>
        </div>

    )

}