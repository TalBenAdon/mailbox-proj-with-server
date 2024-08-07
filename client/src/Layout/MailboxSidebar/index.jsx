import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { MdMoveToInbox } from "react-icons/md";
import { FaPaperPlane } from "react-icons/fa6";
import { BsFillStarFill } from "react-icons/bs";
import { BiSolidPencil } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { AiFillHtml5 } from "react-icons/ai";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { HiMail } from "react-icons/hi";
import { useNavigate } from 'react-router-dom'
import MailboxButton from '../../components/MailboxButton';
import MessageButton from '../../components/MessageButton';
import { Outlet } from 'react-router-dom/dist/umd/react-router-dom.development';
import useAxiosReq from '../../hooks/useAxiosReq';
import { useRead } from '../../context/ReadContext';
export default function MailboxSidebar() {
    const { unreadChats, setUnreadChats } = useRead()
    const { data, error, loading } = useAxiosReq({ method: "GET", url: `chat/inbox/inbox` })

    const calculateUnreadNum = () => {
        let counter = 0
        data.forEach(chat => {
            if (chat.isRead === false) {
                counter++
            }
        });
        setUnreadChats(counter)
    }
    useEffect(() => {
        if (data && data.status !== 404) {

            calculateUnreadNum()
        }
    }, [data])

    const [arrowRight, setArrowRight] = useState(false)
    const navigate = useNavigate()
    const handleNewMessageClick = () => {
        navigate('new-chat')
    }


    const toggleArrow = () => {
        setArrowRight(!arrowRight)
    }
    const arrowStyle = {
        transform: arrowRight ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.3s ease',
        transformOrigin: 'center',
        color: arrowRight && '#00A389'
    }
    const mailBoxNavData = [
        { icon: <MdMoveToInbox />, text: 'Inbox', to: 'inbox' },
        { icon: <FaPaperPlane />, text: 'Sent', to: 'sent', },
        { icon: <BsFillStarFill />, text: 'Favourite', to: 'favourite', },
        { icon: <BiSolidPencil />, text: 'Draft', to: 'draft', },
        { icon: <MdDeleteForever />, text: 'Deleted', to: 'deleted' },
    ]
    const moreData = [{ icon: <AiFillHtml5 />, text: 'Extra', to: "100" },
    { icon: <AiFillHtml5 />, text: 'Extra', to: "101" },
    { icon: <AiFillHtml5 />, text: 'Extra', to: "102" },]
    // ,{icon: <MdOutlineArrowForwardIos/>, text:'More' , to: , },


    return (
        // <div className={styles.whitePadding}>
        <div className={styles.innerLayout}>
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <div className={styles.iconDiv}>
                        <MdOutlineKeyboardArrowLeft />
                    </div>
                    <div className={styles.title}>Mailbox</div>
                </div>
                <hr className={styles.topHr} />
                <MessageButton icon={<HiMail />} title={'New Message'} handleClick={handleNewMessageClick} />
                {mailBoxNavData.map((data, index) => {
                    return <MailboxButton key={index}
                        icon={data.icon}
                        text={data.text}
                        to={data.to}
                        unread={unreadChats}
                    />
                })}
                <div className={styles.arrowAndText}>
                    <div className={styles.flexing} onClick={toggleArrow}>
                        <div className={styles.menuArrow} style={arrowStyle} >
                            <MdOutlineArrowForwardIos />
                        </div>
                        <div className={styles.textClass} style={{ color: arrowRight && '#00A389' }}>
                            More
                        </div>
                    </div>
                    <div className={styles.accordion} style={{ gridTemplateRows: arrowRight ? '1fr' : '0fr' }}>
                        <div style={{ overflowY: 'hidden' }}>
                            <div className={styles.content}>
                                {moreData.map((data, index) => {
                                    return <MailboxButton key={index}
                                        icon={data.icon}
                                        text={data.text}
                                        to={data.to} />
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
        // </div>
    )
}
