import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Assets } from "../../../Constants/General";
import CanvasPanel from './CanvasPanel';
import { motion } from "framer-motion"
import CropperPanel from './CropperPanel';


function SidePanel() {

    const [activeTab, SetActiveTab] = useState(0);
    const [collapsed, SetCollapsed] = useState(true);
    const tabs = ["Canvas", "Cropper", "AI", "Channels", "Effects", "Filters", "Monochrome"];

    const PanelButton = ({ icon, id }) => {
        return (
            <div onClick={() => { SetCollapsed(false); SetActiveTab(id) }} className={`transition ease-in-out duration-300 rounded-lg flex justify-center w-[56px] h-[56px] cursor-inherit ${id != activeTab || collapsed? "hover:bg-[#183142] hover:opacity-80 cursor-pointer" : ""}`}>
                <img src={icon} className="w-[28px]" />
            </div>
        )
    }

    const variants = {
        open: { x: 72 },
        closed: {  x: "-100%" },
    }
    const panelVariants = {
        open: { width: 529 },
        closed: { width: 73 },
    }
    return (
        <motion.div animate={!collapsed ? "open" : "closed"}
            variants={panelVariants}
            transition={{ ease: "easeOut", duration: 0.5 }} className='relative' style={{ width: "529px" }}>
            <div className='bg-dark-blue-2 flex flex-col py-6 px-2 w-[72px] relative gap-4 justify-between border-y-[3px] border-[#3B4E5A] h-full z-10'>
                <motion.div className={`bg-[#26485B] w-[56px] h-[56px] rounded-lg absolute left-[8px] `}
                    animate={{ y: activeTab * (14 + 56), opacity: collapsed? 0 :100 }}
                    transition={{ ease: "easeOut", duration: 0.24 }} />
                <div className=' flex flex-col relative gap-3.5'>
                    <PanelButton icon={Assets.icons.Canvas} id={0} />
                    <PanelButton icon={Assets.icons.Cropper} id={1} />
                    <PanelButton icon={Assets.icons.Background_Remove} id={2} />
                    <PanelButton icon={Assets.icons.Channels} id={3} />
                    <PanelButton icon={Assets.icons.Effects} id={4} />
                    <PanelButton icon={Assets.icons.Filters} id={5} />
                    <PanelButton icon={Assets.icons.Monochrome} id={6} />
                </div>
                <button className='transition ease-in-out duration-300 bg-light-accent w-[56px] h-[56px] rounded-lg relative hover:bg-accent'>
                    <div className="transition ease-in-out duration-300 rounded-lg flex justify-center w-[56px] h-[56px]">
                        <img src={Assets.icons.download_square} className="w-[28px]" />
                    </div>
                </button>
            </div>

            <motion.nav className='bg-dark-blue-2 flex flex-col gap-6 justify-between w-[332px]
                                border-y-[#3B4E5A] border-y-[1px] border-l-[#3B4E5A] border-l-[1px] absolute top-0 h-full z-0'
                animate={!collapsed ? "open" : "closed"}
                variants={variants}
                transition={{ ease: "easeOut", duration: 0.5 }} >

                <div className='bg-[#112634] flex px-5 relative gap-4 justify-between w-full h-16 pt-[3px]' >
                    <div className='text-[18px] text-white font-semibold self-center line-clamp-1 '>{tabs[activeTab]}</div>
                    <img src={Assets.icons.collapse} className="w-[28px] hover:opacity-80 cursor-pointer" onClick={() => SetCollapsed(true)} />
                </div>

                {activeTab==0 && <CanvasPanel />}
                {activeTab==1 && <CropperPanel />}
            </motion.nav>

        </motion.div>
    );
}

export default SidePanel;

