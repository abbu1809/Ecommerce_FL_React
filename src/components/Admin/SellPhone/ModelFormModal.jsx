import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiPlusCircle, FiMinusCircle, FiX } from 'react-icons/fi'; // Using react-icons
import Button from '../../ui/Button'; // Assuming custom Button component
import Input from '../../ui/Input'; // Assuming custom Input component
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';

const ModelFormModal = ({ open, onClose, brandId, seriesId, modelToEdit }) => {
  const [modelName, setModelName] = useState('');
  const [modelImage, setModelImage] = useState('');
  const [variantOptions, setVariantOptions] = useState([{ name: '', options: [''] }]);
  const [questionGroups, setQuestionGroups] = useState([{ groupName: '', questions: [{ questionText: '', options: [''], answerType: 'radio' }] }]);

  const addModel = useAdminSellPhoneStore((state) => state.addModel);
  const updateModel = useAdminSellPhoneStore((state) => state.updateModel);
  const fetchCatalogs = useAdminSellPhoneStore((state) => state.fetchCatalogs); // Corrected: Was fetchSellPhoneCatalog

  useEffect(() => {
    if (modelToEdit) {
      setModelName(modelToEdit.name || '');
      setModelImage(modelToEdit.image || '');
      setVariantOptions(modelToEdit.variantOptions && modelToEdit.variantOptions.length > 0 ? modelToEdit.variantOptions : [{ name: '', options: [''] }]);
      setQuestionGroups(modelToEdit.questionGroups && modelToEdit.questionGroups.length > 0 ? modelToEdit.questionGroups : [{ groupName: '', questions: [{ questionText: '', options: [''], answerType: 'radio' }] }]);
    } else {
      setModelName('');
      setModelImage('');
      setVariantOptions([{ name: '', options: [''] }]);
      setQuestionGroups([{ groupName: '', questions: [{ questionText: '', options: [''], answerType: 'radio' }] }]);
    }
  }, [modelToEdit]);

  const handleSubmit = async () => {
    const modelData = {
      name: modelName,
      image: modelImage,
      variantOptions,
      questionGroups,
    };

    try {
      if (modelToEdit) {
        await updateModel(brandId, seriesId, modelToEdit.id, modelData);
      } else {
        await addModel(brandId, seriesId, modelData);
      }
      await fetchCatalogs(); // Corrected: Was fetchSellPhoneCatalog
      onClose();
    } catch (error) {
      console.error("Failed to save model:", error);
      // Add user-facing error handling here
    }
  };

  // Variant Options Handlers
  const handleVariantOptionChange = (index, field, value) => {
    const newVariantOptions = [...variantOptions];
    newVariantOptions[index][field] = value;
    setVariantOptions(newVariantOptions);
  };

  const handleVariantSubOptionChange = (variantIndex, subOptionIndex, value) => {
    const newVariantOptions = [...variantOptions];
    newVariantOptions[variantIndex].options[subOptionIndex] = value;
    setVariantOptions(newVariantOptions);
  };

  const addVariantOption = () => {
    setVariantOptions([...variantOptions, { name: '', options: [''] }]);
  };

  const removeVariantOption = (index) => {
    const newVariantOptions = variantOptions.filter((_, i) => i !== index);
    setVariantOptions(newVariantOptions);
  };

  const addVariantSubOption = (variantIndex) => {
    const newVariantOptions = [...variantOptions];
    newVariantOptions[variantIndex].options.push('');
    setVariantOptions(newVariantOptions);
  };

  const removeVariantSubOption = (variantIndex, subOptionIndex) => {
    const newVariantOptions = [...variantOptions];
    newVariantOptions[variantIndex].options = newVariantOptions[variantIndex].options.filter((_, i) => i !== subOptionIndex);
    setVariantOptions(newVariantOptions);
  };


  // Question Groups Handlers
  const handleQuestionGroupChange = (groupIndex, field, value) => {
    const newQuestionGroups = [...questionGroups];
    newQuestionGroups[groupIndex][field] = value;
    setQuestionGroups(newQuestionGroups);
  };

  const addQuestionGroup = () => {
    setQuestionGroups([...questionGroups, { groupName: '', questions: [{ questionText: '', options: [''], answerType: 'radio' }] }]);
  };

  const removeQuestionGroup = (groupIndex) => {
    const newQuestionGroups = questionGroups.filter((_, i) => i !== groupIndex);
    setQuestionGroups(newQuestionGroups);
  };

  // Questions within a group Handlers
  const handleQuestionChange = (groupIndex, questionIndex, field, value) => {
    const newQuestionGroups = [...questionGroups];
    newQuestionGroups[groupIndex].questions[questionIndex][field] = value;
    setQuestionGroups(newQuestionGroups);
  };

  const addQuestion = (groupIndex) => {
    const newQuestionGroups = [...questionGroups];
    newQuestionGroups[groupIndex].questions.push({ questionText: '', options: [''], answerType: 'radio' });
    setQuestionGroups(newQuestionGroups);
  };

  const removeQuestion = (groupIndex, questionIndex) => {
    const newQuestionGroups = [...questionGroups];
    newQuestionGroups[groupIndex].questions = newQuestionGroups[groupIndex].questions.filter((_, i) => i !== questionIndex);
    setQuestionGroups(newQuestionGroups);
  };

  // Question Options Handlers
  const handleQuestionOptionChange = (groupIndex, questionIndex, optionIndex, value) => {
    const newQuestionGroups = [...questionGroups];
    newQuestionGroups[groupIndex].questions[questionIndex].options[optionIndex] = value;
    setQuestionGroups(newQuestionGroups);
  };

  const addQuestionOption = (groupIndex, questionIndex) => {
    const newQuestionGroups = [...questionGroups];
    newQuestionGroups[groupIndex].questions[questionIndex].options.push('');
    setQuestionGroups(newQuestionGroups);
  };

  const removeQuestionOption = (groupIndex, questionIndex, optionIndex) => {
    const newQuestionGroups = [...questionGroups];
    newQuestionGroups[groupIndex].questions[questionIndex].options = newQuestionGroups[groupIndex].questions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestionGroups(newQuestionGroups);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {modelToEdit ? 'Edit Model' : 'Add New Model'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Model Name"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            fullWidth
            placeholder="Enter model name"
          />
          <Input
            label="Model Image URL"
            value={modelImage}
            onChange={(e) => setModelImage(e.target.value)}
            fullWidth
            placeholder="Enter model image URL"
          />

          {/* Variant Options */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Variant Options</h3>
            {variantOptions.map((variant, variantIndex) => (
              <div key={variantIndex} className="p-4 my-2 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Input
                    label={`Variant Option ${variantIndex + 1} Name (e.g., Storage, Color)`}
                    value={variant.name}
                    onChange={(e) => handleVariantOptionChange(variantIndex, 'name', e.target.value)}
                    fullWidth
                    className="mr-2"
                    placeholder="Variant Name"
                  />
                  <button onClick={() => removeVariantOption(variantIndex)} className="text-red-500 hover:text-red-700 p-1">
                    <FiMinusCircle size={20} />
                  </button>
                </div>
                {variant.options.map((subOption, subOptionIndex) => (
                  <div className="flex items-center ml-4 mt-2" key={subOptionIndex}>
                    <Input
                      label={`Option ${subOptionIndex + 1}`}
                      value={subOption}
                      onChange={(e) => handleVariantSubOptionChange(variantIndex, subOptionIndex, e.target.value)}
                      fullWidth
                      className="mr-2"
                      placeholder="Option Value"
                    />
                    <button onClick={() => removeVariantSubOption(variantIndex, subOptionIndex)} className="text-red-500 hover:text-red-700 p-1">
                      <FiMinusCircle size={18} />
                    </button>
                    {subOptionIndex === variant.options.length - 1 && (
                      <button onClick={() => addVariantSubOption(variantIndex)} className="text-blue-500 hover:text-blue-700 p-1 ml-1">
                        <FiPlusCircle size={18} />
                      </button>
                    )}
                  </div>
                ))}
                {variant.options.length === 0 && (
                    <Button onClick={() => addVariantSubOption(variantIndex)} variant="outlined" size="sm" className="mt-2 ml-4">
                        <FiPlusCircle className="mr-1" /> Add Option
                    </Button>
                )}
              </div>
            ))}
            <Button onClick={addVariantOption} variant="outlined" className="my-2">
              <FiPlusCircle className="mr-2" /> Add Variant Option Group
            </Button>
          </div>

          {/* Question Groups */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Question Groups</h3>
            {questionGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="p-4 my-2 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Input
                    label={`Question Group ${groupIndex + 1} Name (e.g., Condition, Accessories)`}
                    value={group.groupName}
                    onChange={(e) => handleQuestionGroupChange(groupIndex, 'groupName', e.target.value)}
                    fullWidth
                    className="mr-2"
                    placeholder="Group Name"
                  />
                  <button onClick={() => removeQuestionGroup(groupIndex)} className="text-red-500 hover:text-red-700 p-1">
                    <FiMinusCircle size={20} />
                  </button>
                </div>

                {/* Questions within the group */}
                {group.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="p-3 my-2 ml-4 border border-dashed border-gray-300 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <Input
                        label={`Question ${questionIndex + 1} Text`}
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(groupIndex, questionIndex, 'questionText', e.target.value)}
                        fullWidth
                        className="mr-2"
                        placeholder="Question Text"
                      />
                      <button onClick={() => removeQuestion(groupIndex, questionIndex)} className="text-red-500 hover:text-red-700 p-1">
                        <FiMinusCircle size={18} />
                      </button>
                    </div>
                    <Input
                      label="Answer Type (e.g., radio, checkbox, select)"
                      value={question.answerType}
                      onChange={(e) => handleQuestionChange(groupIndex, questionIndex, 'answerType', e.target.value)}
                      fullWidth
                      className="mt-1"
                      placeholder="Answer Type"
                    />

                    {/* Options for the question */}
                    <p className="text-sm text-gray-600 mt-2 ml-1">Options for Question {questionIndex + 1}:</p>
                    {question.options.map((option, optionIndex) => (
                      <div className="flex items-center ml-2 mt-1" key={optionIndex}>
                        <Input
                          label={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(e) => handleQuestionOptionChange(groupIndex, questionIndex, optionIndex, e.target.value)}
                          fullWidth
                          className="mr-2"
                          placeholder="Option Value"
                          size="sm"
                        />
                        <button onClick={() => removeQuestionOption(groupIndex, questionIndex, optionIndex)} className="text-red-500 hover:text-red-700 p-1">
                          <FiMinusCircle size={16} />
                        </button>
                        {optionIndex === question.options.length - 1 && (
                          <button onClick={() => addQuestionOption(groupIndex, questionIndex)} className="text-blue-500 hover:text-blue-700 p-1 ml-1">
                            <FiPlusCircle size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    {question.options.length === 0 && (
                        <Button onClick={() => addQuestionOption(groupIndex, questionIndex)} variant="outlined" size="sm" className="mt-1 ml-2">
                           <FiPlusCircle className="mr-1" /> Add Option
                        </Button>
                    )}
                  </div>
                ))}
                <Button onClick={() => addQuestion(groupIndex)} variant="outlined" size="sm" className="my-2 ml-4">
                  <FiPlusCircle className="mr-2" /> Add Question to this Group
                </Button>
              </div>
            ))}
            <Button onClick={addQuestionGroup} variant="outlined" className="my-2">
              <FiPlusCircle className="mr-2" /> Add Question Group
            </Button>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button onClick={onClose} variant="secondary">Cancel</Button>
            <Button onClick={handleSubmit} variant="primary">
              {modelToEdit ? 'Save Changes' : 'Add Model'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ModelFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  brandId: PropTypes.string,
  seriesId: PropTypes.string,
  modelToEdit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    image: PropTypes.string,
    variantOptions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
    })),
    questionGroups: PropTypes.arrayOf(PropTypes.shape({
      groupName: PropTypes.string,
      questions: PropTypes.arrayOf(PropTypes.shape({
        questionText: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.string),
        answerType: PropTypes.string,
      })),
    })),
  }),
};

export default ModelFormModal;
