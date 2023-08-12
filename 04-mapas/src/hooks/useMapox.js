import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import {Subject} from "rxjs";
import { useCallback, useEffect, useRef, useState } from "react";

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9oaW5uZXIiLCJhIjoiY2xsMnRkem1oMTA4cjNrbWs3anJ0NmduZCJ9.sjwcUQATtmWBks2QhO1ZGQ";

export const useMapox = (puntoInicial) => {
  const marcadores = useRef({});

  const mapaDiv = useRef();
  // memoriza su producto
  const setRef = useCallback((node) => {
    mapaDiv.current = node;
  });

  // Observables de Rxjs
  const movimientosMarcador = useRef( new Subject()); 
  const nuevoMarcador = useRef( new Subject());

  // Funcion para agregar marcadores
  const agregarMarcador = useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat || ev;

    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();

    marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);

    // Asignamos al objeto de marcadores
    marcadores.current[marker.id] = marker;
    
    if( !id ){
      nuevoMarcador.current.next({
        id: marker.id,
        lng, lat
      })
    }
 
    // Escuchamos movimientos del marcador 
    marker.on('drag', ({target}) => {
      const {id} = target;
      const {lng, lat} = target.getLngLat();

      movimientosMarcador.current.next({
        id, lng, lat
      })
    })
  }, []);

  //Funcion para actualizar la ubicacion del marcador
  const actualizarPosicion = useCallback(({id, lng, lat}) => {
    marcadores.current[id].setLngLat([lng, lat])
  },[])

  const mapa = useRef();
  const [coords, setCoords] = useState(puntoInicial);

  useEffect(() => {
    const { lng, lat, zoom } = puntoInicial;

    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom,
    });

    mapa.current = map;
  }, [puntoInicial]);

  // Cuando se mueve el mapa
  useEffect(() => {
    mapa.current?.on("move", () => {
      const { lng, lat } = mapa.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2),
      });
    });

    //return mapa?.off('move');
  }, []);

  // Agregar marcadores'
  useEffect(() => {
    mapa.current?.on("click", agregarMarcador);
  }, [agregarMarcador]);

  return {
    agregarMarcador,
    coords,
    setRef,
    marcadores,
    nuevoMarcador$: nuevoMarcador.current,
    movimientosMarcador$ : movimientosMarcador.current,
    actualizarPosicion
  };
};
