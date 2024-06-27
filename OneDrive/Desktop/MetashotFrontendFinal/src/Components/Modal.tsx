import React,{MouseEvent} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark} from "@fortawesome/free-solid-svg-icons";
interface ModalProps{
    isVisible:boolean,
    onClose:()=>void,
    children:React.ReactNode,
    isCustomMsg:Boolean

}
const Modal:React.FC<ModalProps> = ({isVisible,onClose,children,isCustomMsg}) => {
    const handleClose = (e:MouseEvent<HTMLDivElement>)=>{
        const target = e.target as HTMLDivElement;
        if(target.id==='wrapper') {
            onClose()}
    }
    if(!isVisible){
        return null
    }
  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={handleClose}>
        <div className={`flex flex-col rounded-xl ${isCustomMsg?'w-[350px]':'w-[600px]'}`}>
            <button className='text-white text-xl place-self-end' onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} className="fas fa-check mr-2" style={{ color: "black" }} />
            </button>
            <div className=' p-2 '>
           {children}
            </div>
        
        </div>
         
      
    </div>
  )
}

export default Modal