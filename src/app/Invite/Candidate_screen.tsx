import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faGlobe, faHourglassStart, faHourglassEnd, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from '../../Components/Modal';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

interface Candidate {
  name: string;
  mail: string;
  number: string;
}

interface FormErrors {
  name: string;
  mail: string;
  number: string;
}

function CandidateScreen() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [error, setError] = useState<string>('');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModal2, setShowModal2] = useState<boolean>(false);

  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateMail, setCandidateMail] = useState<string>('');
  const [candidateNumber, setCandidateNumber] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({ name: '', mail: '', number: '' });

  const [redirect, setRedirect] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interview');

  const handleToggleChange = () => {
    if (!showModal2) {
      setShowModal2(true);
    } else {
      setShowModal2(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowModal2(false);
  };

  const validateDates = () => {
    if (startDate && endDate && endTime && startTime) {
      if (endDate < startDate || (endDate.getTime() === startDate.getTime() && endTime < startTime)) {
        setError('End date/time must be later than start date/time');
      } else {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const dayDiff = timeDiff / (3600 * 24 * 1000);
        if (dayDiff < 3) {
          setError('Minimum 3 days required for the event');
        } else {
          setError('');
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const errors = { name: '', mail: '', number: '' };
    if (!candidateName) errors.name = 'Required';
    if (!candidateMail) errors.mail = 'Required';
    if (!candidateNumber) errors.number = 'Required';
    setFormErrors(errors);
    return !errors.name && !errors.mail && !errors.number;
  };

  const handleAddCandidate = (): void => {
    if (validateForm()) {
      const newCandidate: Candidate = { name: candidateName, mail: candidateMail, number: candidateNumber };
      if (isEditing) {
        const updatedCandidates = candidates.map((c, index) => (index === editIndex ? newCandidate : c));
        setCandidates(updatedCandidates);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setCandidates([...candidates, newCandidate]);
      }
      setCandidateName('');
      setCandidateMail('');
      setCandidateNumber('');
      //setShowModal(false);
    }
  };

  const handleEditCandidate = (index: number): void => {
    const candidate = candidates[index];
    setCandidateName(candidate.name);
    setCandidateMail(candidate.mail);
    setCandidateNumber(candidate.number);
    setIsEditing(true);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteCandidate = (index: number): void => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleCreateEvent = async () => {
    if (!interviewId) {
      setError('Interview ID is missing');
      return;
    }

    const payload = {
      interview: interviewId,
      start: startDate?.toISOString(),
      end: endDate?.toISOString(),
      candidates: candidates.map(candidate => candidate.mail),
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing');
        return;
      }

      const response = await axios.post(
        'https://metashotbackend.azurewebsites.net/interview/schedule',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setRedirect(true);
      } else {
        setError('Failed to schedule the interview');
      }
    } catch (error) {
      console.error('Error scheduling the interview:', error);
      setError('An error occurred while scheduling the interview');
    }
  };

  useEffect(() => {
    validateDates();
  }, [startDate, endDate, startTime, endTime]);

  return (
    <>
      <div className='content ml-8'>
        <div className='flex flex-row justify-between mt-6 md:col-span-1'>
          <button className='w-48 rounded-md bg-inherit invite_cand'>
            <FontAwesomeIcon icon={faCalendar} className="fas fa-check mr-2" style={{ color: "black" }} />
            <select id="type" className='invite_cand text-black font-semibold'>
              <option value="invoice">Personal Calendar</option>
              <option value="payment">Public Calendar</option>
            </select>
          </button>
          <button className='w-48 rounded-md mr-72 invite_cand'>
            <FontAwesomeIcon icon={faGlobe} className="fas fa-check mr-2" style={{ color: "black" }} />
            <select id="type" className='invite_cand text-black font-semibold'>
              <option value="invoice">Public</option>
              <option value="payment">Private</option>
            </select>
          </button>
        </div>
        <div className='text-5xl mt-4 font-semibold text-black'> Interview Name</div>
        <div className='flex flex-row text-black'>
          <div className='mt-8 max-w-2xl bg-[#E2F3E5] h-24 rounded-md pr-2 pt-2'>
            {/* For first row */}
            <div className='flex items-center justify-between'>
              <div className='px-4 mr-10'>
                <FontAwesomeIcon icon={faHourglassStart} className="fas fa-check mr-2 text-black" />
                Start
              </div>
              <div className='px-10 text-black'>
                <DatePicker
                  selected={startDate}
                  dateFormat={"EEE/d-MMM"}
                  onChange={(date) => setStartDate(date)}
                  className='text-center rounded-md invite_time'
                />
              </div>
              <div className='text-black'>
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className='text-center rounded-md bg-[#c5d8c5]'
                />
              </div>
            </div>
            {/* Second row */}
            <div className='flex items-center mt-5 justify-between text-black'>
              <div className='px-4 mr-10'>
                <FontAwesomeIcon icon={faHourglassEnd} className="fas fa-check mr-2" style={{ color: "black" }} />
                Stop
              </div>
              <div className='px-10'>
                <DatePicker
                  selected={endDate}
                  dateFormat={"EEE/d-MMM"}
                  onChange={(date) => setEndDate(date)}
                  className='text-center rounded-md bg-[#c5d8c5]'
                />
              </div>
              <div>
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className='text-center rounded-md invite_time'
                />
              </div>
            </div>
            {error && <div className='text-red-500 mt-4'>{error}</div>}
          </div>
          <div className='h-24 bg-slate-300 ml-10 mt-8 w-44 rounded-md px-2 pt-3'>
            <div className='text-lg'>Kindly note:</div>
            <div className='text-sm'>Events set to Public</div>
            <div className='text-sm'>will be open for anyone</div>
            <div className='text-sm'>to join.</div>
          </div>
        </div>
        <div className='mt-8'>
          <button className='rounded-md px-5 py-2 bg-inherit border-inherit text-black color-green' onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faChevronRight} className="fas fa-check mr-2" style={{ color: "black" }} />
            Invite Candidates
          </button>
        </div>
        <Modal isVisible={showModal} onClose={() => setShowModal(false)} isCustomMsg={false}>
          <div className='flex flex-col justify-between'>
            <div className='flex flex-row items-center'>
              <h1 className='text-xl font-semibold mb-2 flex-grow'>{isEditing ? 'Edit' : 'Add'} Candidate</h1>
              <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faTimes} className="fas fa-check mr-2" style={{ color: "white" }} />
                Close
              </button>
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-bold mb-2'>Candidate Name</label>
              <input
                type='text'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
              />
              {formErrors.name && <span className='text-red-500'>{formErrors.name}</span>}
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-bold mb-2'>Candidate Mail</label>
              <input
                type='email'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={candidateMail}
                onChange={(e) => setCandidateMail(e.target.value)}
              />
              {formErrors.mail && <span className='text-red-500'>{formErrors.mail}</span>}
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 font-bold mb-2'>Candidate Number</label>
              <input
                type='text'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={candidateNumber}
                onChange={(e) => setCandidateNumber(e.target.value)}
              />
              {formErrors.number && <span className='text-red-500'>{formErrors.number}</span>}
            </div>
            <div className='flex justify-end'>
              <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={handleAddCandidate}>
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </Modal>
        <Modal isVisible={showModal2} onClose={() => setShowModal2(false)} isCustomMsg={true}>
          <h1 className='text-xl font-semibold mb-2'>Candidates List</h1>
          {candidates.length === 0 ? (
            <p>No candidates added yet.</p>
          ) : (
            candidates.map((candidate, index) => (
              <div key={index} className='mb-4'>
                <div className='flex justify-between'>
                  <div>
                    <p>Name: {candidate.name}</p>
                    <p>Email: {candidate.mail}</p>
                    <p>Number: {candidate.number}</p>
                  </div>
                  <div>
                    <button className='bg-yellow-500 text-white px-2 py-1 rounded-md mr-2' onClick={() => handleEditCandidate(index)}>Edit</button>
                    <button className='bg-red-500 text-white px-2 py-1 rounded-md' onClick={() => handleDeleteCandidate(index)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </Modal>
        <div className='mt-4'>
          <button className='bg-green-500 text-white px-4 py-2 rounded-md' onClick={handleCreateEvent}>
            Create Event
          </button>
        </div>
        {redirect && (
          <p className='text-green-500'>Interview scheduled successfully!{' '}
            <Link href="/PastInterviews">
              <span className='cursor-pointer'>Click here to view past interviews.</span>
            </Link>
          </p>
        )}
      </div>
    </>
  );
}

export default CandidateScreen;
