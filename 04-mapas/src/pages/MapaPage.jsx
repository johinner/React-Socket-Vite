import { useContext, useEffect } from "react";
import { useMapox } from "../hooks/useMapox";
import { SocketContext } from "../context/SocketContext";

//Renderizar unica ves
const puntoInicial = {
  lng: -75.5499 ,
  lat: 10.4209,
  zoom: 15
}

export const MapaPage = () => {

  const { socket } = useContext(SocketContext);

  const {coords, setRef, nuevoMarcador$, movimientosMarcador$, agregarMarcador, actualizarPosicion} = useMapox(puntoInicial);

  // Escuchar los marcadores existentes
  useEffect(() => {
    socket.on('marcadores-activos', (marcadores) => {
      
      for(const key of Object.keys(marcadores)){
        agregarMarcador( marcadores[key], key);
      }
    })

  }, [socket, agregarMarcador])
  
  
  // Nuevo Marcador
  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => {
      //console.log(marcador);
      socket.emit('marcador-nuevo', marcador)
    })
  },[nuevoMarcador$, socket]);


  // Movimiento de marcador
  useEffect(() => {
    movimientosMarcador$.subscribe(movimiento => {
      //console.log(movimiento)
      socket.emit('marcador-actualizado', movimiento)
    })
  }, [socket, movimientosMarcador$]);

  //Mover marcador mediante sockets
  useEffect(() => {
    socket.on('marcador-actualizado', (marcador) => {
      actualizarPosicion(marcador)
    })

  }, [socket, actualizarPosicion])

  //Escuchar nuevos maracdores
  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => {
      
      agregarMarcador(marcador, marcador.id)

    })
  }, [socket, agregarMarcador]);


  return (
    <>
      <div className="info">
        Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
      </div>

      <div ref={setRef} className="mapContainer" />
    </>
  );
};
