import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import ConfirmationModal from '../../../../common/ConfirmationModal'
import SubSectionModal from "./SubSectionModal"
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"

function NestedView({handleChangeEditSectionName}) {

  const {course} = useSelector((state) => state.course)
  const {token} = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const [addSubSection,setAddSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleleSection= async (sectionId) => {
    const result= await deleteSection({
      sectionId,
      courseId: course?._id,
      token,
    })
    if(result){
      // console.log("Printing",course);
      console.log(result);
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);


  }
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token })
    // console.log("resulttttttt",result)
    if (result) {
      // update the structure of course
      const updatedCourseContent = course?.courseContent?.map((section) =>
        section._id === sectionId ? result : section
      )
      //console.log("Printing :",updatedCourseContent)
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }



  return (
    <div>
      <div className="flex flex-col">
        {course?.courseContent?.map((section) => (
          <details key={section._id} open>
            <summary className="flex items-center justify-between gap-x-3 border-b-richblack-300 border-b-2 ">
              <div className="flex gap-x-3 items-center">
                <RxDropdownMenu className="text-2xl text-richblack-50"/>
                <p className="font-semibold text-richblack-50">{section?.sectionName}</p>
              </div>
              <div className="flex gap-x-3 items-center">
                <button 
                onClick={() => handleChangeEditSectionName(
                  section._id,
                  section.sectionName
                )}>
                  <MdEdit  className="text-richblack-300 text-xl"/>
                </button>
                <button onClick={() => setConfirmationModal({
                    text1: "Delete this Section?",
                    text2: "All the lectures in this section will be deleted",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleDeleleSection(section._id),
                    btn2Handler: () => setConfirmationModal(null),
                })}>
                  <RiDeleteBin6Line className="text-richblack-300 text-xl"  /> 
                </button>
                <span className="text-richblack-300 text-xl">|</span>
                <AiFillCaretDown className="text-richblack-300 text-xl"/>

              </div>
            </summary>
           
            <div className="px-6 pb-4">
              {/* Show all the subsections  */}
              {console.log(section?.subSection)}
              {section?.subSection?.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.title}
                    </p>
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add New Lecture to Section */}
              <button
                onClick={() => setAddSubSection(section._id)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {/* Modal Display */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}

      
    </div>
  )
}

export default NestedView
