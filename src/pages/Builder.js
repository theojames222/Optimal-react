import React, { useEffect, useState } from "react";
import {
  fetchExercises,
  saveWorkoutToFirestore,
} from "../services/firestoreServices";
import { AiOutlineMinus, AiOutlineDelete, AiOutlineLink } from "react-icons/ai";

export default function Builder() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([
    {
      id: Date.now(),
      name: "",
      description: "",
      instructions: "",
      exercises: [],
      search: "",
    },
  ]);
  const [workoutName, setWorkoutName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const getExercises = async () => {
      try {
        const exercisesData = await fetchExercises();
        setExercises(exercisesData);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };
    getExercises();
  }, []);

  const handleSearchChange = (blockId, value) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId ? { ...block, search: value } : block
      )
    );
  };

  const addNewBlock = () => {
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        id: Date.now(),
        name: "",
        description: "",
        instructions: "",
        exercises: [],
        search: "",
      },
    ]);
  };

  const addExerciseToBlock = (blockId, exercise) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          const order = block.exercises.length + 1;
          return {
            ...block,
            exercises: [
              ...block.exercises,
              {
                ...exercise,
                order,
                weight: "",
                reps: "",
                modality: "reps",
                rest: "",
                notes: "",
                setType: "",
                rir: "",
                supersetted: false,
                additionalSets: [],
              },
            ],
            search: "",
          };
        }
        return block;
      })
    );
  };

  const removeExerciseFromBlock = (blockId, exerciseId) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            exercises: block.exercises
              .filter((ex) => ex.id !== exerciseId)
              .map((ex, i) => ({ ...ex, order: i + 1 })),
          };
        }
        return block;
      })
    );
  };

  const removeBlock = (blockId) => {
    setBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== blockId)
    );
  };

  const saveWorkout = async () => {
    const workout = {
      name: workoutName,
      description,
      instructions,
      date: new Date().toISOString(),
      blocks: blocks.map((block) => ({
        name: block.name,
        description: block.description,
        instructions: block.instructions,
        exercises: block.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          order: exercise.order,
          weight: exercise.weight,
          reps: exercise.reps,
          modality: exercise.modality,
          rest: exercise.rest,
          notes: exercise.notes,
          setType: exercise.setType,
          rir: exercise.rir,
          supersetted: exercise.supersetted,
          additionalSets: exercise.additionalSets,
        })),
      })),
    };
    await saveWorkoutToFirestore(workout);
    alert("Workout saved successfully!");
    clearWorkout();
  };

  const clearWorkout = () => {
    setWorkoutName("");
    setDescription("");
    setInstructions("");
    setBlocks([
      {
        id: Date.now(),
        name: "",
        description: "",
        instructions: "",
        exercises: [],
        search: "",
      },
    ]);
  };

  const setAdditionalSetField = (
    blockId,
    exerciseId,
    setIndex,
    field,
    value
  ) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              exercises: block.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      additionalSets: exercise.additionalSets.map((set, i) =>
                        i === setIndex ? { ...set, [field]: value } : set
                      ),
                    }
                  : exercise
              ),
            }
          : block
      )
    );
  };

  const toggleSuperset = (blockId, exerciseId) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          // Toggle the 'supersetted' property for the selected exercise
          const updatedExercises = block.exercises.map((exercise) =>
            exercise.id === exerciseId
              ? { ...exercise, supersetted: !exercise.supersetted }
              : exercise
          );

          // Reorder exercises with appropriate suffixes (a, b, c) for linked sets
          let currentGroup = 1; // Track group numbers for ordering
          let suffixIndex = 0; // Reset suffix index for each group

          updatedExercises.forEach((exercise) => {
            if (exercise.supersetted) {
              const suffix = String.fromCharCode(97 + suffixIndex); // 'a', 'b', 'c', etc.
              exercise.order = `${currentGroup}${suffix}`;
              suffixIndex++; // Move to the next suffix in the current group
            } else {
              // Reset to next group and restart suffix for standalone exercise
              exercise.order = `${currentGroup}`;
              currentGroup++;
              suffixIndex = 0; // Reset suffix for next linked group
            }
          });

          return { ...block, exercises: updatedExercises };
        }
        return block;
      })
    );
  };

  const addSetsToExercise = (blockId, exerciseId, setCount) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (block.id === blockId) {
          return {
            ...block,
            exercises: block.exercises.map((exercise) =>
              exercise.id === exerciseId
                ? {
                    ...exercise,
                    additionalSets: Array.from({ length: setCount }, () => ({
                      weight: exercise.weight,
                      reps: exercise.reps,
                      modality: exercise.modality,
                      rest: exercise.rest,
                      notes: exercise.notes,
                      setType: exercise.setType,
                      rir: exercise.rir,
                    })),
                  }
                : exercise
            ),
          };
        }
        return block;
      })
    );
  };

  const isSaveDisabled =
    !workoutName || blocks.every((block) => block.exercises.length === 0);

  if (loading) return <p>Loading exercises...</p>;
  if (exercises.length === 0) return <p>No exercises found.</p>;

  // Define helper functions to update exercise fields
  const setWeight = (blockId, exerciseId, value) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              exercises: block.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, weight: value }
                  : exercise
              ),
            }
          : block
      )
    );
  };

  const setReps = (blockId, exerciseId, value) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              exercises: block.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, reps: value }
                  : exercise
              ),
            }
          : block
      )
    );
  };

  const setModality = (blockId, exerciseId, value) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              exercises: block.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, modality: value }
                  : exercise
              ),
            }
          : block
      )
    );
  };

  const setRir = (blockId, exerciseId, value) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              exercises: block.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, rir: value }
                  : exercise
              ),
            }
          : block
      )
    );
  };

  const setRest = (blockId, exerciseId, value) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              exercises: block.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, rest: value }
                  : exercise
              ),
            }
          : block
      )
    );
  };

  const setNotes = (blockId, exerciseId, value) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId
          ? {
              ...block,
              exercises: block.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? { ...exercise, notes: value }
                  : exercise
              ),
            }
          : block
      )
    );
  };

  return (
    <div>
      <h1>Workout Builder</h1>
      <div>
        <label>
          Workout Name:
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </label>
        <label>
          Instructions:
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </label>
      </div>

      {blocks.map((block) => (
        <div
          key={block.id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ flex: 1 }}>Exercise Block</h2>
            <input
              type="text"
              placeholder="Block Name"
              value={block.name}
              onChange={(e) =>
                setBlocks((prevBlocks) =>
                  prevBlocks.map((b) =>
                    b.id === block.id ? { ...b, name: e.target.value } : b
                  )
                )
              }
            />
            <input
              type="text"
              placeholder="Block Description"
              value={block.description}
              onChange={(e) =>
                setBlocks((prevBlocks) =>
                  prevBlocks.map((b) =>
                    b.id === block.id
                      ? { ...b, description: e.target.value }
                      : b
                  )
                )
              }
            />
            <input
              type="text"
              placeholder="Block Instructions"
              value={block.instructions}
              onChange={(e) =>
                setBlocks((prevBlocks) =>
                  prevBlocks.map((b) =>
                    b.id === block.id
                      ? { ...b, instructions: e.target.value }
                      : b
                  )
                )
              }
            />
            <AiOutlineDelete
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => removeBlock(block.id)}
            />
          </div>

          <input
            type="text"
            placeholder="Search exercise"
            value={block.search}
            onChange={(e) => handleSearchChange(block.id, e.target.value)}
          />
          <ul>
            {block.search &&
              exercises
                .filter((exercise) =>
                  exercise.name
                    .toLowerCase()
                    .includes(block.search.toLowerCase())
                )
                .map((exercise) => (
                  <li
                    key={exercise.id}
                    onClick={() => addExerciseToBlock(block.id, exercise)}
                  >
                    {exercise.name}
                  </li>
                ))}
          </ul>
          <h3>Selected Exercises</h3>
          <ul>
            {block.exercises.map((exercise, index) => (
              <li key={exercise.id}>
                <AiOutlineMinus
                  style={{
                    cursor: "pointer",
                    color: "red",
                    marginRight: "5px",
                  }}
                  onClick={() => removeExerciseFromBlock(block.id, exercise.id)}
                />
                {exercise.order}. {exercise.name}
                <div style={{ marginLeft: "20px" }}>
                  <label>
                    Weight:{" "}
                    <input
                      type="text"
                      value={exercise.weight}
                      onChange={(e) =>
                        setWeight(block.id, exercise.id, e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Reps:{" "}
                    <input
                      type="text"
                      value={exercise.reps}
                      onChange={(e) =>
                        setReps(block.id, exercise.id, e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Modality:{" "}
                    <select
                      value={exercise.modality}
                      onChange={(e) =>
                        setModality(block.id, exercise.id, e.target.value)
                      }
                    >
                      <option value="reps">Reps</option>
                      <option value="time">Time</option>
                      <option value="distance">Distance</option>
                    </select>
                  </label>
                  <label>
                    RIR:{" "}
                    <input
                      type="text"
                      value={exercise.rir}
                      onChange={(e) =>
                        setRir(block.id, exercise.id, e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Rest:{" "}
                    <input
                      type="text"
                      value={exercise.rest}
                      onChange={(e) =>
                        setRest(block.id, exercise.id, e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Notes:{" "}
                    <input
                      type="text"
                      value={exercise.notes}
                      onChange={(e) =>
                        setNotes(block.id, exercise.id, e.target.value)
                      }
                    />
                  </label>
                  <select
                    onChange={(e) =>
                      addSetsToExercise(
                        block.id,
                        exercise.id,
                        parseInt(e.target.value)
                      )
                    }
                  >
                    <option>Add Sets</option>
                    {[...Array(9)].map((_, i) => (
                      <option key={i} value={i + 2}>
                        +{i + 2} Sets
                      </option>
                    ))}
                  </select>
                </div>
                {/* Insert Editable Additional Sets JSX Here */}
                {exercise.additionalSets &&
                  exercise.additionalSets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      style={{ marginLeft: "40px", marginTop: "10px" }}
                    >
                      <strong>Set {setIndex + 2}</strong>
                      <label>
                        Weight:{" "}
                        <input
                          type="text"
                          value={set.weight}
                          onChange={(e) =>
                            setAdditionalSetField(
                              block.id,
                              exercise.id,
                              setIndex,
                              "weight",
                              e.target.value
                            )
                          }
                        />
                      </label>
                      <label>
                        Reps:{" "}
                        <input
                          type="text"
                          value={set.reps}
                          onChange={(e) =>
                            setAdditionalSetField(
                              block.id,
                              exercise.id,
                              setIndex,
                              "reps",
                              e.target.value
                            )
                          }
                        />
                      </label>
                      <label>
                        Modality:{" "}
                        <select
                          value={set.modality}
                          onChange={(e) =>
                            setAdditionalSetField(
                              block.id,
                              exercise.id,
                              setIndex,
                              "modality",
                              e.target.value
                            )
                          }
                        >
                          <option value="reps">Reps</option>
                          <option value="time">Time</option>
                          <option value="distance">Distance</option>
                        </select>
                      </label>
                      <label>
                        RIR:{" "}
                        <input
                          type="text"
                          value={set.rir}
                          onChange={(e) =>
                            setAdditionalSetField(
                              block.id,
                              exercise.id,
                              setIndex,
                              "rir",
                              e.target.value
                            )
                          }
                        />
                      </label>
                      <label>
                        Rest:{" "}
                        <input
                          type="text"
                          value={set.rest}
                          onChange={(e) =>
                            setAdditionalSetField(
                              block.id,
                              exercise.id,
                              setIndex,
                              "rest",
                              e.target.value
                            )
                          }
                        />
                      </label>
                      <label>
                        Notes:{" "}
                        <input
                          type="text"
                          value={set.notes}
                          onChange={(e) =>
                            setAdditionalSetField(
                              block.id,
                              exercise.id,
                              setIndex,
                              "notes",
                              e.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  ))}
                <AiOutlineLink
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    marginLeft: "5px",
                  }}
                  onClick={() => toggleSuperset(block.id, exercise.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button
        onClick={addNewBlock}
        style={{ marginRight: "10px", padding: "10px 20px" }}
      >
        Add New Block
      </button>
      <button
        onClick={saveWorkout}
        disabled={isSaveDisabled}
        style={{
          marginRight: "10px",
          padding: "10px 20px",
          backgroundColor: isSaveDisabled ? "grey" : "blue",
          color: "white",
          cursor: isSaveDisabled ? "not-allowed" : "pointer",
        }}
      >
        Save Workout
      </button>
      <button
        onClick={clearWorkout}
        style={{ padding: "10px 20px", backgroundColor: "red", color: "white" }}
      >
        Clear
      </button>
    </div>
  );
}
