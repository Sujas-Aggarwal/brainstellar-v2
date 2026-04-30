import { useState, useEffect } from "react";
import { useUser } from "~/contexts/UserContext";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "~/lib/firebase";
import { MessageSquare, Send, CornerDownRight, User as UserIcon } from "lucide-react";

interface Comment {
  id: string;
  puzzleId: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar: string;
  parentId: string | null;
  createdAt: Timestamp;
}

export function Comments({ 
  puzzleId = "global" 
}: { 
  puzzleId?: string | number;
}) {
  const pId = String(puzzleId);
  const { user, signIn } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("puzzleId", "==", pId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log(`Fetching comments for pId: ${pId}. Found: ${snapshot.docs.length}`);
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      // Sort in memory to avoid index requirement
      fetchedComments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeA - timeB;
      });
      
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [puzzleId]);

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!user) {
      signIn();
      return;
    }

    const text = parentId ? replyText : newComment;
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        puzzleId: pId,
        text,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userAvatar: user.photoURL || "",
        parentId,
        createdAt: serverTimestamp(),
      });
      if (parentId) {
        setReplyText("");
        setReplyTo(null);
      } else {
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rootComments = comments.filter(c => !c.parentId);

  return (
    <div className="mt-16 pt-8 border-t border-[var(--border)]">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="w-4 h-4" />
        <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Discussion</h3>
        <span className="text-[10px] font-medium text-[var(--muted-fg)] bg-[var(--muted-bg)] px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </div>

      {user ? (
        <form onSubmit={(e) => handleSubmit(e)} className="mb-12 relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the discussion..."
            className="w-full bg-[var(--muted-bg)] border border-[var(--border)] p-4 rounded-lg text-sm min-h-[100px] focus:border-[var(--fg)] outline-none transition-all resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="absolute bottom-4 right-4 bg-[var(--fg)] text-[var(--bg)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
            <Send className="w-3 h-3" />
          </button>
        </form>
      ) : (
        <div className="mb-12 p-8 border border-dashed border-[var(--border)] rounded-lg text-center">
          <p className="text-sm text-[var(--muted-fg)] mb-4">You must be logged in to participate in the discussion.</p>
          <button
            onClick={signIn}
            className="px-6 py-2 border border-[var(--fg)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all"
          >
            Login with Google
          </button>
        </div>
      )}

      <div className="space-y-4">
        {rootComments.length > 0 ? (
          rootComments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              allComments={comments} 
              user={user} 
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              setReplyTo={setReplyTo}
              replyTo={replyTo}
              replyText={replyText}
              setReplyText={setReplyText}
            />
          ))
        ) : (
          <p className="text-center py-12 text-sm text-[var(--muted-fg)] italic">
            No comments yet. Be the first to start the conversation!
          </p>
        )}
      </div>
    </div>
  );
}

function CommentItem({ 
  comment, 
  allComments, 
  user, 
  handleSubmit, 
  isSubmitting,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
  isReply = false 
}: { 
  comment: Comment; 
  allComments: Comment[]; 
  user: any; 
  handleSubmit: (e: React.FormEvent, parentId: string | null) => Promise<void>;
  isSubmitting: boolean;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  isReply?: boolean;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const replies = allComments.filter(c => c.parentId === comment.id);

  return (
    <div className={`group ${isReply ? 'ml-8 mt-4' : 'mt-6'}`}>
      <div className="flex gap-3">
        {comment.userAvatar ? (
          <img src={comment.userAvatar} alt="" className="w-8 h-8 rounded-full border border-[var(--border)]" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--muted-bg)] flex items-center justify-center border border-[var(--border)]">
            <UserIcon className="w-4 h-4 text-[var(--muted-fg)]" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">{comment.userName}</span>
            <span className="text-[10px] text-[var(--muted-fg)]">
              {comment.createdAt?.toDate().toLocaleDateString() || "Just now"}
            </span>
          </div>
          
          <p className="text-sm leading-relaxed text-[var(--fg)] opacity-90">{comment.text}</p>
          
          <div className="mt-2 flex items-center gap-4">
            {user && (
              <button 
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors flex items-center gap-1"
              >
                <CornerDownRight className="w-3 h-3" />
                Reply
              </button>
            )}

            {replies.length > 0 && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="text-[10px] font-bold uppercase tracking-widest text-[var(--c-overall)] hover:opacity-80 transition-opacity flex items-center gap-1"
              >
                {showReplies ? "Hide Replies" : `Show Replies (${replies.length})`}
              </button>
            )}
          </div>

          {replyTo === comment.id && (
            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-4 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-transparent border-b border-[var(--border)] py-1 text-sm focus:border-[var(--fg)] outline-none transition-colors"
                autoFocus
              />
              <button 
                disabled={isSubmitting || !replyText.trim()}
                className="p-1 hover:text-[var(--fg)] text-[var(--muted-fg)] disabled:opacity-30 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {showReplies && replies.length > 0 && (
            <div className="border-l border-[var(--border)] ml-1 pl-1">
              {replies.map(reply => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  allComments={allComments} 
                  user={user} 
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  setReplyTo={setReplyTo}
                  replyTo={replyTo}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  isReply={true} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
