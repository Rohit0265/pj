import React, { useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets/assets'
import Loading from '../students/Loading';


function StudentEnrolled() {

    const [data, setdata] = useState([]);

    const student = (async () => {
        setdata(dummyStudentEnrolled)
    })


    useEffect(() => {
        student()
    }, [])

    return data ? (
        <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <div className='w-full'>
                <h2 className='pb-4 text-lg font-medium'>Enrolled Students</h2>
                <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
                    <table className='md:table-auto table-fixed w-full overflow-hidden'>
                        <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
                            <tr>
                                <td className='px-4 py-3 font-semibold truncate'>#</td>
                                <td className='px-4 py-3 font-semibold truncate'>Student Name</td>
                                <td className='px-4 py-3 font-semibold truncate'>Course Detail</td>
                                <td className='px-4 py-3 font-semibold truncate'>Purchased On</td>
                            </tr>
                        </thead>
                        <tbody className='text-sm text-gray-500'>
                            {data.map((course, index) => {
                                return (
                                    <tr className='border-b border-gray-500/20 '>
                                        <td className='px-5'>{index + 1}</td>
                                        <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                                            <img src={course.student.imageUrl} alt="" className='w-10' />
                                            <span className='truncate hidden  md:block'>{course.student.name}</span>
                                        </td>
                                        <td className='px-4 py-3'>
                                            {course.courseTitle}
                                        </td>
                                        <td className='px-4 py-3'>
                                            {new Date(course.purchaseDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    ) : <Loading />
}

export default StudentEnrolled