'use client'
import React, { useRef, useState } from 'react'
import UploadNav from './UploadNav'
import Firstmedia from './Firstmedia'
import TextComp from './TextComponent/TextComp'

type Props = {}

enum STEPS {
    UPLOAD_MEDIA = 0,
    OTHER_STUFF = 1
}

const UploadComponent = (props: Props) => {
    const [step, setStep] = useState(STEPS.OTHER_STUFF)
    const fileInputRef = useRef<HTMLInputElement | null> (null)
    const [LocalUrl, setLocalUrl] = useState<string>()
    const [fileType, setFileType] = useState<"image" | "video">("image")
    const [title, setTitle] = useState<string>()


    const onNext = () => {
        setStep((value) => value + 1)
    }


    const handleFile = (file:File) => {
        const reader = new FileReader()
        if(file.type.startsWith('image/')){
            setFileType('image')
        }else if(file.type.startsWith('video/')){
            setFileType('video')
        }
        reader.onload = async () => {
            if(reader.result){
                setLocalUrl(reader.result as string)
            }
        }
        reader.readAsDataURL(file)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files.length > 0){
            handleFile(event.target.files[0])
        }
        onNext()
    }

    const handleClick = () => {
        if(fileInputRef.current){
            fileInputRef.current.click()
        }
    }
    
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        if(event.dataTransfer.files && event.dataTransfer.files.length > 0){
            handleFile(event.dataTransfer.files[0])
        }
        onNext()
    }
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }
    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }
  return (
    <div>
        <div className='w-full'>
            <UploadNav/>
            <div className='content-container pt-10'>
                <div>
                    {step === STEPS.UPLOAD_MEDIA && (
                        <div>
                            <h2 className='text-center md:text-3xl font-bold text-2xl'>What you have been working on?</h2>
                            <div 
                            onClick={handleClick}
                            onDrop={handleDrop}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                             className='border-[2px] border-dashed rounded-lg mt-12 flex justify-around md:w-9/12 w-11/12 mx-auto cursor-pointer'>
                                <div className='flex flex-col items-center justify-center py-40 w-full'>
                                    <div className='flex flex-col items-center justify-center'>
                                        <img src="/pic.png" className='w-24' alt="Image" />
                                        <div className='text-center pt-3'>
                                            Drag and Drop a Media or
                                            <span className='text-pink-500'> Browse</span>
                                        </div>
                                    </div>
                                    <div className='text-sm pt-5 text-neutral-500 text-center'>
                                        <span>Minimum 1600px width recommended.Max 10MB </span>
                                        <span>Max 10MB each</span>
                                        <span> (20 MB for Video)</span>
                                    </div>
                                    <ul className='grid md:grid-cols-2 grid-cols-1 text-sm pt-10 gap-x-16 gap-2 text-neutral-500 list-disc'>
                                        <li>High resolution images (png, jpg, gif)</li>
                                        <li>Video (mp4)</li>
                                        <li>Animated gif</li>
                                        <li>Only upload media you own the rights to</li>
                                    </ul>
                                </div>
                            </div>
                            <input 
                            type="file"
                            ref={fileInputRef}
                            className='hidden'
                            accept='image/*,video/*'
                            onChange={handleFileChange}
                             />
                        </div>
                    )}
                    {step === STEPS.OTHER_STUFF && (
                        <div>
                            <div>
                                <div className='w-9/12 mx-auto'>
                                    <textarea name="" id="" cols={30} rows={1} placeholder='Give me a name' className='focus:outline-none text-4xl font-bold' value={title} onChange={(e) => setTitle(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className='pb-20'>
                                <Firstmedia type={fileType} url={LocalUrl}/>
                                <TextComp/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default UploadComponent