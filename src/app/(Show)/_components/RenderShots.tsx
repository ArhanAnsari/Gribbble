'use client'
import { Items, Upload } from '@prisma/client'
import React, { useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getUploadDataByInifiteQuery } from '@/actions/upload'
import { Button } from '@/components/ui/button'
import EachShot from './EachShot'
import { useInView } from "react-intersection-observer";
import Image from 'next/image'
import ShotSkeleton from './ShotSkeleton'

type Props = {}

export interface ShotDataType extends Upload {
    items:Items[]
}

interface MetaData {
    lastCursor:string | null
    hasNextpage:boolean
}

interface UploadData {
    data: ShotDataType[]
    metaData:MetaData
}

type FetchUploadDataResponse  = {
    success:boolean
    data:ShotDataType[]
    metaData:MetaData
    error?:string
}

const RenderShots = (props: Props) => {
    const { ref, inView } = useInView();

    const fetchUploadData = async (take:string, lastCursor:string) => {
        try {
            const response = await getUploadDataByInifiteQuery(take,lastCursor)
            if(response && 'data' in response){
                const {data} = response
                return data
            } else {
                console.log("Unexpected data structure",error)
            }
        } catch (error) {
            console.log("Error fetching data", error)
        }
    }

    const {
        data:UploadData,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        isLoading
    } = useInfiniteQuery<FetchUploadDataResponse>({
        queryKey: ['upload-shot-data'],
        queryFn:({pageParam = ""}) => fetchUploadData("10",`${pageParam}`),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            return lastPage?.metaData?.lastCursor
        }
    })

    useEffect(() => {
        if(inView && hasNextPage){
            fetchNextPage()
        }
    },[hasNextPage,inView])

    if(isLoading){
        return(
            <ShotSkeleton/>
        )
    }
    console.log("sdcds",UploadData)

  return (
    <div className='pt-10'>
        <div className='grid gap-10 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
            {UploadData?.pages.map((page,index) => (
                page.data.map((shot,shotindex) => {
                    const isLastShot = page.data.length === shotindex + 1
                    return(
                        <div 
                        key={`${index}-${shotindex}`}
                        ref={isLastShot ? ref : null}
                        >
                            <EachShot shot={shot}/>
                        </div>
                    )
                })
            ))}
            <div className='flex items-center justify-around mt-4'>
                {isFetchingNextPage && (
                    <div className='animate-bounce'>
                        <Image src='/gribbble-icon.webp' width={30} height={30} alt='Icon'/>
                    </div>
                )}
            </div>
        </div>
        {/* <Button onClick={() => fetchNextPage()}>sdvs d</Button> */}
    </div>
  )
}

export default RenderShots