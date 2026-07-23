import { useEffect, useRef, useState } from "react";
import { Box, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { retrieveMostLoved } from "./selector";
import { Product } from "../../../lib/types/product";
import {
  AiRecommendInput,
  AiRecommendResult,
} from "../../../lib/types/ai";
import AiService from "../../services/AiService";
import { serverApi, Messages } from "../../../lib/config";

/** REDUX SELECTOR **/
const theEditRetriever = createSelector(
  retrieveMostLoved,
  (mostLoved) => ({ mostLoved })
);

const NOTES_MAX = 300;

/** One-tap prompts — clicking writes the full sentence into the textarea.
    These are examples, not choices: nothing persists. */
const EXAMPLES: { label: string; sentence: string }[] = [
  {
    label: "Calm bedroom",
    sentence:
      "A small bedroom with white walls and morning light. I want it calm and uncluttered.",
  },
  {
    label: "Bright living room",
    sentence:
      "A bright living room with big windows and a neutral palette. Something warm but simple.",
  },
  {
    label: "Cosy study",
    sentence:
      "A small study corner with warm wood and low light. I want it cosy and focused.",
  },
];

/** Cycles once while the request is in flight, then holds on the last phrase. */
const LOADING_PHRASES = [
  "Reading your description…",
  "Looking through the collection…",
  "Choosing pieces that fit…",
];
const PHASE_MS = 1600;

/** neutral fallback: hide a missing image, leaving the --surface ground */
const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.visibility = "hidden";
};

export default function TheEdit() {
  const { mostLoved } = useSelector(theEditRetriever);
  const history = useHistory();

  // Advisor state — free-text description is the only input
  const [notes, setNotes] = useState<string>("");
  const [submittedNotes, setSubmittedNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [phase, setPhase] = useState<number>(0);
  const [result, setResult] = useState<AiRecommendResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  // drive the loading sequence: one phrase every ~1.6s, then hold on the last.
  // prefers-reduced-motion: show only the first phrase, no cycling.
  useEffect(() => {
    if (!loading) {
      setPhase(0);
      return;
    }
    setPhase(0);
    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      if (i >= LOADING_PHRASES.length - 1) {
        setPhase(LOADING_PHRASES.length - 1);
        window.clearInterval(id);
      } else {
        setPhase(i);
      }
    }, PHASE_MS);
    return () => window.clearInterval(id);
  }, [loading]);

  const chooseProduct = (id: string) => {
    history.push(`/products/${id}`);
  };

  // write a full example sentence into the textarea, then focus at its end
  const applyExample = (sentence: string) => {
    setNotes(sentence);
    const el = notesRef.current;
    if (el) {
      window.requestAnimationFrame(() => {
        el.focus();
        const end = el.value.length;
        el.setSelectionRange(end, end);
      });
    }
  };

  const canSubmit = notes.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    const trimmed = notes.trim();
    const input: AiRecommendInput = { notes: trimmed };

    try {
      setLoading(true);
      setErrorMessage(null);
      setSubmittedNotes(trimmed);
      const service = new AiService();
      const data = await service.getRecommendations(input);
      setResult(data);
    } catch (err) {
      const message =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        Messages.error1;
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // back to the input state, keeping the previous description
  const handleReset = () => {
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className={"edit-frame"}>
      <Container>
        <Box className={"category-title"}>The Edit</Box>

        <div className={"edit-row"}>
          {/* LEFT — Room Advisor (AI-powered) */}
          <section className={"ai-advisor"} aria-label={"Room Advisor"}>
            <header className={"col-head"}>
              <span className={"col-eyebrow"}>Room Advisor</span>
              <span className={"col-lead"}>
                Tell us about your space. We'll suggest the pieces.
              </span>
            </header>

            {result ? (
              /* RESULT STATE */
              <div className={"advisor-result"} aria-live={"polite"}>
                <span className={"advisor-result-eyebrow"}>
                  Suggested for you
                </span>

                {submittedNotes ? (
                  <p className={"advisor-echo"}>— &ldquo;{submittedNotes}&rdquo;</p>
                ) : null}

                {result.summary ? (
                  <p className={"advisor-summary"}>{result.summary}</p>
                ) : null}

                {result.recommendations.length !== 0 ? (
                  <ul className={"advisor-recs"}>
                    {result.recommendations.map((rec) => {
                      const product: Product = rec.product;
                      const imagePath = `${serverApi}/${product.productImages[0]}`;
                      return (
                        <li key={product._id} className={"advisor-rec-row"}>
                          <button
                            type={"button"}
                            className={"advisor-rec-link"}
                            onClick={() => chooseProduct(product._id)}
                          >
                            <span className={"advisor-rec-thumb"}>
                              <img
                                src={imagePath}
                                alt={""}
                                onError={hideOnError}
                              />
                            </span>
                            <span className={"advisor-rec-body"}>
                              <span className={"advisor-rec-name"}>
                                {product.productName}
                              </span>
                              <span className={"advisor-rec-reason"}>
                                {rec.reason}
                              </span>
                            </span>
                            <span className={"advisor-rec-price"}>
                              ${product.productPrice}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className={"advisor-empty"}>
                    Nothing in the collection matched closely enough.
                  </p>
                )}

                <button
                  type={"button"}
                  className={"advisor-reset"}
                  onClick={handleReset}
                >
                  Try another description
                </button>
              </div>
            ) : (
              /* INPUT STATE */
              <form className={"advisor-form"} onSubmit={handleSubmit}>
                <div className={"advisor-field"}>
                  <label className={"advisor-label"} htmlFor={"advisor-notes"}>
                    Describe your space
                  </label>
                  <textarea
                    id={"advisor-notes"}
                    ref={notesRef}
                    className={"advisor-notes"}
                    rows={4}
                    maxLength={NOTES_MAX}
                    placeholder={
                      "A small bedroom with white walls and a lot of morning light. I want it calm and uncluttered."
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <span className={"advisor-counter"}>
                    {notes.length} / {NOTES_MAX}
                  </span>
                </div>

                <div className={"advisor-examples"}>
                  <span className={"advisor-examples-lead"}>Try one of these</span>
                  <div className={"advisor-example-list"}>
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex.label}
                        type={"button"}
                        className={"advisor-example"}
                        onClick={() => applyExample(ex.sentence)}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type={"submit"}
                  className={"advisor-submit"}
                  disabled={!canSubmit || loading}
                >
                  Get Suggestions
                </button>

                {loading ? (
                  <p className={"advisor-loading"} aria-live={"polite"}>
                    <span
                      key={phase}
                      className={"advisor-loading-phrase"}
                    >
                      {LOADING_PHRASES[phase]}
                    </span>
                  </p>
                ) : null}

                {errorMessage ? (
                  <div className={"advisor-notice"} role={"status"}>
                    {errorMessage}
                  </div>
                ) : null}
              </form>
            )}
          </section>

          {/* RIGHT — Most Loved (compact ranked list) */}
          <section className={"most-loved"} aria-label={"Most Loved"}>
            <header className={"col-head"}>
              <span className={"col-eyebrow"}>Most Loved</span>
              <span className={"col-lead"}>
                What our customers keep coming back to.
              </span>
            </header>

            {mostLoved.length !== 0 ? (
              <ol className={"loved-list"}>
                {mostLoved.slice(0, 5).map((product: Product, i: number) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <li key={product._id} className={"loved-row"}>
                      <button
                        type={"button"}
                        className={"loved-link"}
                        onClick={() => chooseProduct(product._id)}
                      >
                        <span className={"loved-rank"}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={"loved-thumb"}>
                          <img src={imagePath} alt={""} onError={hideOnError} />
                        </span>
                        <span className={"loved-body"}>
                          <span className={"loved-name"}>
                            {product.productName}
                          </span>
                          <span className={"loved-price"}>
                            ${product.productPrice}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <Box className={"loved-empty"}>
                Our most-loved pieces are on their way.
              </Box>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
