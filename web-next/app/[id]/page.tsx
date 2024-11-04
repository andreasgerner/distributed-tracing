import Modal from "@/lib/modal";

export default async function Details({params}: { params: Promise<{ id: string }> }) {
  return <Modal id={(await params).id}/>;
}
