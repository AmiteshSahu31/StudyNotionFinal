import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import IconBtn from "../../../../common/IconBtn"
import NestedView from "./NestedView"
import { setStep,setCourse,setEditCourse } from "../../../../../slices/courseSlice"
import { updateSection,createSection } from "../../../../../services/operations/courseDetailsAPI"


function CourseBuilderForm() {
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const [editSectionName,setEditSectionName]= useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { register,
            handleSubmit,
            formState: { errors },
            setValue } = useForm();
            
    const goBack = () => {
        dispatch(setStep(1))
        dispatch(setEditCourse(true));
    }
    const goToNext = () => {
       // console.log("printing",course?.courseContent);
        if(course?.courseContent.length === 0) {
            toast.error("Please add at least one section to your course.")
            return;
           }
        if(course?.courseContent.some( (section) => section.subSection.length === 0)) {
            toast.error("Please add at least one subsection to your section.")
            return;
        } 
        dispatch(setStep(3))
     }

     
     const cancelEdit = () => {
        setEditSectionName(null);
        setValue("sectionName", ""); // Clear the form input
      };
      

    const onSubmit = async (data) => {
        setLoading(true);
        let result;
      
        try {
          if (editSectionName) {
            // Update section
            result = await updateSection(
              {
                sectionId: editSectionName,
                sectionName: data.sectionName,
                courseId: course?._id,
              },
              token
            );
          } else {
            // Create new section
            result = await createSection(
              {
                sectionName: data.sectionName,
                courseId: course?._id,
              },
              token
            );
          }
      
          if (result) {
            dispatch(setCourse(result)); // Update Redux state
            cancelEdit(); // Reset edit mode and form
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      

      const handleChangeEditSectionName = (sectionId, sectionName) => {
        if (editSectionName === sectionId) {
          cancelEdit(); // Reset if the same section is clicked
        } else {
          setEditSectionName(sectionId); // Set the section to edit
          setValue("sectionName", sectionName); // Populate the form with the section name
        }
      };
      
// console.log("course",course.courseContent.length)
    return (
        <div className=" bg-richblack-800 rounded-md p-6 border-[1px] border-richblack-700 space-y-8">
            <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-2 mb-5  ">
              <label htmlFor="sectionName" 
                className="text-richblack-5 text-[16px]"> Section Name <sup className="text-pink-200">*</sup></label>
                <input
                id="sectionName"
                placeholder="Add a section to your course"
                {...register("sectionName", {required:true})}
                className="form-style w-full"
                />
                {errors.sectionName && <span className="text-xs ml-2 tracking-wide text-pink-200">This field is required</span>}
              </div>
              <div className="flex items-end gap-x-4 ">
              <IconBtn
                text={editSectionName ? "Edit Section Name" : "Create Section"}
                type="submit"
                disabled={loading} // Ensure button disables only when `loading` is true
                outline={true}
                >
                <IoAddCircleOutline className="text-yellow-50" fontSize={20} />
                </IconBtn>

                {
                    editSectionName && (
                        <button type="button"
                        onClick={cancelEdit}
                        className="text-sm text-richblack-300 underline ">
                            Cancel Edit
                        </button>
                    )
                }
              </div>
            </form>

            {/* Nested View */}
            {
            course?.courseContent?.length > 0 && (
               <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
            )
            }

            <div className="flex justify-end gap-x-3">
            <button type="button"
            onClick={goBack}
            className="flex items-center bg-richblack-300 text-richblack-900 font-semibold rounded-md py-[8px] px-[20px] gap-x-2">
                Back
            </button>
            <IconBtn
            text={"Next"}
            disabled={loading}
            onclick={goToNext}>
                <MdNavigateNext className="text-richblack-900" />
            </IconBtn>
            </div>
        </div>
    )
}

export default CourseBuilderForm
