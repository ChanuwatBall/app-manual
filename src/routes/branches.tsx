import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import thailand from "../data/thailand.json";
import AndamanLogo from "../assets/images/andaman-logo.svg";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { branches, branchMapUrl, regionLabels } from "../data/branches";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: `${branches.length} สาขาทั่วประเทศ | Andaman GPS` },
      { property: "og:title", content: `${branches.length} สาขาทั่วประเทศ | Andaman GPS` },
      {
        name: "description",
        content:
          "ค้นหาสาขา Andaman GPS ทั่วประเทศไทย พร้อมแผนที่ 3D ที่อยู่ เบอร์โทร และเส้นทางไปสำนักงาน",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id:
      typeof search.id === "string" && branches.some((branch) => branch.id === search.id)
        ? search.id
        : undefined,
  }),
  component: BranchesPage,
});

function BranchesPage() {
  const [zoom, setZoom] = useState(1);
  const { id } = Route.useSearch();
  const navigate = Route.useNavigate();
  const activeBranch = id ?? "";
  const setActiveBranch = useCallback(
    (branchId: string) => {
      void navigate({ search: { id: branchId || undefined }, replace: true });
    },
    [navigate],
  );
  const changeZoom = useCallback(
    (amount: number) => setZoom((current) => Math.min(3, Math.max(0.78, current + amount))),
    [],
  );
  const [resetKey, setResetKey] = useState(0);

  return (
    <main className="branches-page">
      <BranchMap
        activeBranch={activeBranch}
        onSelect={setActiveBranch}
        onZoom={changeZoom}
        resetKey={resetKey}
        zoom={zoom}
        onZoomIn={() => changeZoom(0.12)}
        onZoomOut={() => changeZoom(-0.12)}
        onReset={() => {
          setResetKey((key) => key + 1);
          setZoom(1);
          setActiveBranch("");
        }}
      />
    </main>
  );
}

function BranchMap({
  activeBranch,
  onSelect,
  onZoom,
  resetKey,
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  activeBranch: string;
  onSelect: (id: string) => void;
  onZoom: (amount: number) => void;
  resetKey: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  const branch = branches.find((item) => item.id === activeBranch);
  const [expandedId, setExpandedId] = useState("");
  const expanded = Boolean(branch && expandedId === branch.id);
  const toggleDetails = () => setExpandedId(expanded ? "" : activeBranch);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 861px)");
    const expandOnDesktop = () => {
      if (desktopQuery.matches && activeBranch) {
        setExpandedId(activeBranch);
      }
    };

    expandOnDesktop();
    desktopQuery.addEventListener("change", expandOnDesktop);
    return () => desktopQuery.removeEventListener("change", expandOnDesktop);
  }, [activeBranch]);

  const selectAdjacent = (offset: number) => {
    const index = branches.findIndex((item) => item.id === activeBranch);
    setExpandedId("");
    onSelect(branches[(index + offset + branches.length) % branches.length].id);
  };
  return (
    <section
      className="branch-map-section fullscreen-branches"
      aria-label="แผนที่ 3 มิติสาขา Andaman GPS"
    >
      {!branch && (
        <div className="mobile-map-logo">
          <a href="/" aria-label="Andaman GPS — กลับหน้าคู่มือ">
            <img src={AndamanLogo} alt="Andaman GPS" width="417" height="91" />
          </a>
          <h1>{branches.length} สาขาทั่วประเทศ</h1>
        </div>
      )}
      <div className="branch-map-copy">
        <a className="branches-map-logo" href="/" aria-label="Andaman GPS — กลับหน้าคู่มือ">
          <img src={AndamanLogo} alt="Andaman GPS" width="417" height="91" />
        </a>
        <div className="office-list-heading">
          <h2>เลือกสาขา</h2>
          <span>{branches.length} สาขา</span>
        </div>
        <nav className="office-selector regional-selector" aria-label="เลือกสาขาตามภูมิภาค">
          {Object.entries(regionLabels).map(([region, label]) => (
            <section className="office-region-group" key={region} aria-label={label}>
              <h3>{label}</h3>
              <div className="office-region-rows">
                {branches
                  .filter((item) => item.region === region)
                  .map((item) => (
                    <button
                      key={item.id}
                      aria-pressed={activeBranch === item.id}
                      onClick={() => onSelect(item.id)}
                    >
                      <span className="office-number">
                        {branches.findIndex((branch) => branch.id === item.id) + 1}
                      </span>
                      <span className="office-name">จ.{item.name}</span>
                      {item.hq && <span className="office-hq">สำนักงานใหญ่</span>}
                    </button>
                  ))}
              </div>
            </section>
          ))}
        </nav>
      </div>
      <div className="branch-map-viewport">
        <ThreeBranchMap
          activeBranch={activeBranch}
          zoom={zoom}
          onSelect={onSelect}
          onZoom={onZoom}
          resetKey={resetKey}
        />
        <div className="map-controls" aria-label="ควบคุมการซูมแผนที่">
          <button onClick={onZoomIn} aria-label="ซูมเข้า">
            <Plus size={18} />
          </button>
          <button onClick={onZoomOut} aria-label="ซูมออก">
            <Minus size={18} />
          </button>
          <button onClick={onReset} aria-label="รีเซ็ตมุมมอง">
            <RotateCcw size={16} />
          </button>
        </div>
        <div className="map-zoom-label">ZOOM {Math.round(zoom * 100)}%</div>
      </div>
      {branch && (
        <aside
          className={`office-detail compact-office ${expanded ? "is-expanded" : "is-collapsed"}`}
          aria-label="ข้อมูลสาขาที่เลือก"
          aria-live="polite"
        >
          <button
            className="office-sheet-handle"
            onClick={toggleDetails}
            aria-label={expanded ? "ย่อรายละเอียด" : "ขยายรายละเอียด"}
            aria-expanded={expanded}
          >
            <span />
          </button>
          <button className="office-close" onClick={onReset} aria-label="ปิดข้อมูลสาขา">
            ×
          </button>
          {expanded && branch.photo && (
            <div className="office-detail-banner" id="office-photo">
              <img src={branch.photo} alt={`รูปสถานที่สาขา ${branch.name}`} />
            </div>
          )}
          <div className="office-detail-body">
            <small className="office-region-chip">
              {regionLabels[branch.region]} · สาขาที่{" "}
              {branches.findIndex((item) => item.id === branch.id) + 1}/{branches.length}
            </small>
            <div className="office-title-row">
              <h2>
                {branch.hq ? "สำนักงานใหญ่" : "สาขา"} จ.{branch.name}
              </h2>
              <div className="office-adjacent">
                <button onClick={() => selectAdjacent(-1)} aria-label="สาขาก่อนหน้า">
                  ‹
                </button>
                <button onClick={() => selectAdjacent(1)} aria-label="สาขาถัดไป">
                  ›
                </button>
              </div>
            </div>
            <dl>
              <dt>ที่อยู่</dt>
              <dd className="office-address" title={branch.address}>
                {branch.address}
              </dd>
              <dt>เบอร์โทร</dt>
              <dd>
                <a href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`}>{branch.phone}</a>{" "}
                {branch.contact && `(${branch.contact})`}
              </dd>
            </dl>
            {expanded && (
              <iframe
                key={branch.id}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(branch.query || `${branch.lat},${branch.lng}`)}&z=16&output=embed`}
                title={`แผนที่สำนักงาน ${branch.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            )}
            <div className="office-detail-actions">
              <a href={branchMapUrl(branch)} target="_blank" rel="noreferrer">
                นำทาง
              </a>
              <a href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`}>โทรเลย</a>
            </div>
            <button className="office-expand" onClick={toggleDetails} aria-expanded={expanded}>
              {expanded ? "⌄ ย่อรายละเอียด" : "⌃ ดูรูปสถานที่และแผนที่"}
            </button>
            <button className="office-overview" onClick={onReset}>
              กลับไปดูทุกสาขา
            </button>
          </div>
        </aside>
      )}
    </section>
  );
}

function ThreeBranchMap({
  activeBranch,
  zoom,
  onSelect,
  onZoom,
  resetKey,
}: {
  activeBranch: string;
  zoom: number;
  onSelect: (id: string) => void;
  onZoom: (amount: number) => void;
  resetKey: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panRef = useRef(new THREE.Vector2());
  useEffect(() => {
    panRef.current.set(0, 0);
  }, [activeBranch, resetKey]);
  const zoomRef = useRef(zoom);
  const activeBranchRef = useRef(activeBranch);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    activeBranchRef.current = activeBranch;
  }, [activeBranch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    const world = new THREE.Group();
    scene.add(world);
    scene.add(new THREE.HemisphereLight(0xd8eeff, 0x0b356d, 2.3));
    const sun = new THREE.DirectionalLight(0xffffff, 2.8);
    sun.position.set(-5, 10, 7);
    sun.castShadow = true;
    scene.add(sun);
    const shapes = thailand.map((rings) => {
      const points = (ring: number[][]) =>
        ring.map(
          ([lng, lat]) =>
            new THREE.Vector2((lng - 100.9) * Math.cos((13.5 * Math.PI) / 180), lat - 13.2),
        );
      const shape = new THREE.Shape(points(rings[0]));
      rings.slice(1).forEach((ring) => shape.holes.push(new THREE.Path(points(ring))));
      return shape;
    });
    // A lightweight procedural relief texture gives the raised Thailand object
    // visible terrain variation without adding a large raster-map dependency.
    const terrainCanvas = document.createElement("canvas");
    terrainCanvas.width = 512;
    terrainCanvas.height = 512;
    const terrainContext = terrainCanvas.getContext("2d");
    if (!terrainContext) return;
    const terrainPixels = terrainContext.createImageData(terrainCanvas.width, terrainCanvas.height);
    for (let y = 0; y < terrainCanvas.height; y++) {
      for (let x = 0; x < terrainCanvas.width; x++) {
        const elevation =
          0.5 +
          Math.sin(x * 0.043 + y * 0.009) * 0.17 +
          Math.sin(y * 0.064 - x * 0.014) * 0.14 +
          Math.sin(Math.hypot(x - 132, y - 156) * 0.085) * 0.1 +
          Math.sin(Math.hypot(x - 365, y - 326) * 0.055) * 0.09;
        const shade = THREE.MathUtils.clamp(elevation, 0, 1);
        const pixel = (y * terrainCanvas.width + x) * 4;
        terrainPixels.data[pixel] = 20 + shade * 27;
        terrainPixels.data[pixel + 1] = 116 + shade * 83;
        terrainPixels.data[pixel + 2] = 161 + shade * 77;
        terrainPixels.data[pixel + 3] = 255;
      }
    }
    terrainContext.putImageData(terrainPixels, 0, 0);
    terrainContext.lineWidth = 1;
    terrainContext.strokeStyle = "rgba(220, 251, 255, 0.20)";
    for (let y = 22; y < terrainCanvas.height; y += 18) {
      terrainContext.beginPath();
      for (let x = 0; x <= terrainCanvas.width; x += 8) {
        const contour = y + Math.sin(x * 0.045 + y * 0.08) * 5 + Math.sin(x * 0.014) * 3;
        if (x === 0) terrainContext.moveTo(x, contour);
        else terrainContext.lineTo(x, contour);
      }
      terrainContext.stroke();
    }
    const terrainTexture = new THREE.CanvasTexture(terrainCanvas);
    terrainTexture.colorSpace = THREE.SRGBColorSpace;
    terrainTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const countryGeometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 3,
    });
    // ExtrudeGeometry UVs are in world units; normalize them so the texture spans Thailand once.
    countryGeometry.computeBoundingBox();
    const geometryBounds = countryGeometry.boundingBox;
    const positions = countryGeometry.getAttribute("position");
    const uvs = countryGeometry.getAttribute("uv");
    if (geometryBounds && uvs) {
      const width = geometryBounds.max.x - geometryBounds.min.x;
      const height = geometryBounds.max.y - geometryBounds.min.y;
      for (let index = 0; index < positions.count; index++) {
        uvs.setXY(
          index,
          (positions.getX(index) - geometryBounds.min.x) / width,
          (positions.getY(index) - geometryBounds.min.y) / height,
        );
      }
      uvs.needsUpdate = true;
    }
    const country = new THREE.Mesh(countryGeometry, [
      new THREE.MeshStandardMaterial({
        map: terrainTexture,
        color: 0xffffff,
        emissive: 0x0c5277,
        emissiveIntensity: 0.2,
        roughness: 0.55,
        metalness: 0.12,
      }),
      new THREE.MeshStandardMaterial({ color: 0x5269d7, emissive: 0x253a95, roughness: 0.45 }),
    ]);
    country.rotation.x = -Math.PI / 2;
    country.castShadow = true;
    country.receiveShadow = true;
    world.add(country);
    const countryBounds = new THREE.Box3().setFromObject(country).expandByScalar(0.5);
    const border = new THREE.LineSegments(
      new THREE.EdgesGeometry(country.geometry, 30),
      new THREE.LineBasicMaterial({ color: 0xa5eeff, transparent: true, opacity: 0.65 }),
    );
    border.rotation.copy(country.rotation);
    world.add(border);
    // Public-domain Natural Earth 1:110m boundaries, rendered in equirectangular projection.
    // https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson
    const texture = new THREE.TextureLoader().load("/world-map.svg");
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const longitudeScale = Math.cos((13.5 * Math.PI) / 180);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(360 * longitudeScale, 180),
      new THREE.MeshBasicMaterial({ map: texture }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(-100.9 * longitudeScale, -0.13, 13.2);
    ground.receiveShadow = true;
    world.add(ground);
    const grid = new THREE.GridHelper(70, 140, 0x435a98, 0x293d73);
    grid.position.y = -0.1;
    grid.material.transparent = true;
    grid.material.opacity = 0.23;
    world.add(grid);

    const pins = branches.map((branch) => {
      const group = new THREE.Group();
      group.userData.id = branch.id;
      group.position.set(
        (branch.lng - 100.9) * Math.cos((13.5 * Math.PI) / 180),
        1.05,
        -(branch.lat - 13.2),
      );
      const pinShape = new THREE.Shape();
      pinShape.moveTo(0, -0.3);
      pinShape.bezierCurveTo(-0.07, -0.19, -0.19, 0.01, -0.19, 0.15);
      pinShape.bezierCurveTo(-0.19, 0.36, 0.19, 0.36, 0.19, 0.15);
      pinShape.bezierCurveTo(0.19, 0.01, 0.07, -0.19, 0, -0.3);
      const pin = new THREE.Mesh(
        new THREE.ExtrudeGeometry(pinShape, {
          depth: 0.1,
          bevelEnabled: true,
          bevelSegments: 2,
          bevelSize: 0.015,
          bevelThickness: 0.015,
        }),
        new THREE.MeshStandardMaterial({
          color: 0xef7628,
          emissive: 0x7a2600,
          emissiveIntensity: 0.45,
          roughness: 0.4,
          metalness: 0.08,
        }),
      );
      pin.position.z = -0.05;
      pin.castShadow = true;
      group.add(pin);
      const pinCenter = new THREE.Mesh(
        new THREE.CircleGeometry(0.067, 20),
        new THREE.MeshBasicMaterial({ color: 0x8c2d00, side: THREE.DoubleSide }),
      );
      pinCenter.position.set(0, 0.15, 0.066);
      group.add(pinCenter);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.18, 0.25, 28),
        new THREE.MeshBasicMaterial({
          color: 0xef7628,
          transparent: true,
          opacity: 0.75,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.25;
      group.add(ring);
      world.add(group);
      return { group, ring };
    });
    const hub = pins.find((pin) => pin.group.userData.id === "phuket")?.group.position;
    const lightCanvas = document.createElement("canvas");
    lightCanvas.width = 128;
    lightCanvas.height = 128;
    const lightContext = lightCanvas.getContext("2d");
    if (!lightContext) return;
    const lightGradient = lightContext.createRadialGradient(64, 64, 0, 64, 64, 64);
    lightGradient.addColorStop(0, "rgba(255, 255, 255, 0.96)");
    lightGradient.addColorStop(0.08, "rgba(203, 247, 255, 0.88)");
    lightGradient.addColorStop(0.28, "rgba(69, 210, 255, 0.36)");
    lightGradient.addColorStop(0.58, "rgba(44, 185, 255, 0.08)");
    lightGradient.addColorStop(1, "rgba(44, 185, 255, 0)");
    lightContext.fillStyle = lightGradient;
    lightContext.fillRect(0, 0, 128, 128);
    const lightTexture = new THREE.CanvasTexture(lightCanvas);
    const routes: {
      curve: THREE.QuadraticBezierCurve3;
      pulse: THREE.Group;
      startedAt: number;
      duration: number;
    }[] = [];
    if (hub)
      pins
        .filter(({ group }) => group.userData.id !== "phuket")
        .forEach(({ group }) => {
          const end = group.position;
          const routeLength = hub.distanceTo(end);
          // Raise longer connections higher so the network reads as a true 3D route map.
          const arcHeight = THREE.MathUtils.clamp(1.4 + routeLength * 0.18, 1.7, 4.5);
          const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(hub.x, 0.8, hub.z),
            new THREE.Vector3((hub.x + end.x) / 2, arcHeight, (hub.z + end.z) / 2),
            new THREE.Vector3(end.x, 0.8, end.z),
          );
          world.add(
            new THREE.Line(
              new THREE.BufferGeometry().setFromPoints(curve.getPoints(72)),
              new THREE.LineBasicMaterial({ color: 0x78ddff, transparent: true, opacity: 0.52 }),
            ),
          );
          const pulse = new THREE.Group();
          const aura = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: lightTexture,
              color: 0x48d9ff,
              transparent: true,
              opacity: 0.56,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            }),
          );
          aura.scale.setScalar(1.28);
          const glow = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: lightTexture,
              color: 0xe1fbff,
              transparent: true,
              opacity: 0.9,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            }),
          );
          glow.scale.setScalar(0.54);
          pulse.add(aura, glow);
          pulse.visible = false;
          world.add(pulse);
          routes.push({
            curve,
            pulse,
            // A new route duration is picked for every outgoing signal.
            startedAt: 0,
            duration: 1700 + Math.random() * 900,
          });
        });
    const activeRouteIndexes = new Set<number>();
    let previousRouteIndex = -1;
    let nextPulseAt = 0;
    const raycaster = new THREE.Raycaster();
    let dragging = false,
      moved = false,
      lastX = 0,
      lastY = 0;
    const activePointers = new Map<number, { x: number; y: number }>();
    let pinchDistance = 0;
    let pinchStartZoom = zoomRef.current;
    const getPinchDistance = () => {
      const [first, second] = [...activePointers.values()];
      return first && second ? Math.hypot(first.x - second.x, first.y - second.y) : 0;
    };
    const selectPin = (event: MouseEvent) => {
      if (moved) return;
      const rect = canvas.getBoundingClientRect();
      raycaster.setFromCamera(
        new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          1 - ((event.clientY - rect.top) / rect.height) * 2,
        ),
        camera,
      );
      const hit = raycaster.intersectObjects(
        pins.map((pin) => pin.group),
        true,
      )[0];
      if (hit) onSelect(hit.object.parent?.userData.id);
    };
    const zoomPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.55);
    let zoomAnchor: {
      point: THREE.Vector3;
      pointer: THREE.Vector2;
      branchId: string;
      until: number;
    } | null = null;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const amount = -Math.sign(event.deltaY) * 0.1;
      const nextZoom = THREE.MathUtils.clamp(zoomRef.current + amount, 0.78, 3);
      if (nextZoom === zoomRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        1 - ((event.clientY - rect.top) / rect.height) * 2,
      );
      camera.updateMatrixWorld();
      raycaster.setFromCamera(pointer, camera);
      const point = raycaster.ray.intersectPlane(zoomPlane, new THREE.Vector3());
      if (point)
        zoomAnchor = {
          point,
          pointer,
          branchId: activeBranchRef.current,
          until: performance.now() + 1500,
        };
      zoomRef.current = nextZoom;
      onZoom(amount);
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      canvas.setPointerCapture(event.pointerId);
      if (activePointers.size === 2) {
        // Pinching owns the gesture, preventing the second finger from panning the map.
        zoomAnchor = null;
        dragging = false;
        moved = true;
        pinchDistance = getPinchDistance();
        pinchStartZoom = zoomRef.current;
        return;
      }
      if (activePointers.size > 2) return;
      zoomAnchor = null;
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const move = (event: PointerEvent) => {
      if (activePointers.has(event.pointerId)) {
        activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }
      if (activePointers.size >= 2) {
        event.preventDefault();
        const distance = getPinchDistance();
        if (!pinchDistance || !distance) return;
        const nextZoom = THREE.MathUtils.clamp(
          pinchStartZoom * (distance / pinchDistance),
          0.78,
          3,
        );
        const amount = nextZoom - zoomRef.current;
        if (Math.abs(amount) > 0.003) {
          zoomRef.current = nextZoom;
          onZoom(amount);
        }
        return;
      }
      if (!dragging) return;
      const dx = event.clientX - lastX,
        dy = event.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      const scale = (camera.position.y * 0.65) / canvas.clientHeight;
      const selected = pins.find((pin) => pin.group.userData.id === activeBranchRef.current);
      const originX = selected?.group.position.x ?? 0;
      const originZ = selected?.group.position.z ?? 0;
      panRef.current.x = THREE.MathUtils.clamp(
        panRef.current.x - dx * scale,
        countryBounds.min.x - originX,
        countryBounds.max.x - originX,
      );
      panRef.current.y = THREE.MathUtils.clamp(
        panRef.current.y - dy * scale,
        countryBounds.min.z - originZ,
        countryBounds.max.z - originZ,
      );
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const up = (event: PointerEvent) => {
      activePointers.delete(event.pointerId);
      if (activePointers.size < 2) pinchDistance = 0;
      dragging = false;
    };
    canvas.addEventListener("wheel", wheel, { passive: false });
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("click", selectPin);
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    camera.position.set(0, 26, 3);
    camera.lookAt(0, 0, 0);
    world.rotation.x = 0;
    world.rotation.z = 0;
    const cameraTarget = new THREE.Vector3();
    const desiredTarget = new THREE.Vector3();
    const desiredPosition = new THREE.Vector3();
    let previousTime = 0;
    let viewportKey = "";
    let frame = 0;
    const render = (time: number) => {
      // Launch closely staggered signals so two or three destinations can glow at once.
      if (time >= nextPulseAt && activeRouteIndexes.size < 3 && routes.length) {
        const choices = routes
          .map((_, index) => index)
          .filter((index) => !activeRouteIndexes.has(index) && index !== previousRouteIndex);
        const nextRouteIndex = choices[Math.floor(Math.random() * choices.length)] ?? 0;
        const route = routes[nextRouteIndex];
        route.startedAt = time;
        route.duration = 1650 + Math.random() * 1150;
        route.pulse.visible = true;
        activeRouteIndexes.add(nextRouteIndex);
        previousRouteIndex = nextRouteIndex;
        nextPulseAt = time + 180 + Math.random() * 280;
      }
      activeRouteIndexes.forEach((routeIndex) => {
        const route = routes[routeIndex];
        const progress = (time - route.startedAt) / route.duration;
        if (progress >= 1) {
          route.pulse.visible = false;
          activeRouteIndexes.delete(routeIndex);
        } else {
          const point = route.curve.getPoint(THREE.MathUtils.smootherstep(progress, 0, 1));
          route.pulse.position.copy(point);
          const pulseScale = 0.9 + Math.sin(progress * Math.PI) * 0.5;
          route.pulse.scale.setScalar(pulseScale);
        }
      });
      const selectedPin = pins.find((pin) => pin.group.userData.id === activeBranchRef.current);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const mobile = width <= 860;
      const leftPanel = mobile ? 0 : 300;
      const rightPanel = !mobile && selectedPin ? 390 : 0;
      const bottomPanel = mobile ? (selectedPin ? height * 0.43 : 104) : 0;
      const key = `${width}:${height}:${Boolean(selectedPin)}`;
      if (key !== viewportKey) {
        camera.setViewOffset(
          width,
          height,
          (rightPanel - leftPanel) / 2,
          bottomPanel / 2,
          width,
          height,
        );
        viewportKey = key;
      }
      if (selectedPin) desiredTarget.copy(selectedPin.group.position);
      else desiredTarget.set(0, 0, 0);
      desiredTarget.x += panRef.current.x;
      desiredTarget.z += panRef.current.y;
      const distance =
        (selectedPin
          ? Math.max(10, 8 / camera.aspect)
          : Math.max(
              (26 * height) / Math.max(200, height - bottomPanel),
              (15 * height) / Math.max(200, width - leftPanel - rightPanel),
            )) / zoomRef.current;
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.1) : 1 / 60;
      previousTime = time;
      const ease = 1 - Math.exp(-4 * delta);
      cameraTarget.lerp(desiredTarget, ease);
      // Keep the focus distance while viewing a selected office at 45° elevation.
      // Overview: 35° away from overhead, gently orbiting around due south.
      const elevation = selectedPin ? Math.PI / 4 : THREE.MathUtils.degToRad(55);
      const azimuth = selectedPin ? 0 : Math.sin(time * 0.00012) * 0.22;
      desiredPosition.set(
        desiredTarget.x + distance * Math.cos(elevation) * Math.sin(azimuth),
        desiredTarget.y + distance * Math.sin(elevation),
        desiredTarget.z + distance * Math.cos(elevation) * Math.cos(azimuth),
      );
      camera.position.lerp(desiredPosition, ease);
      camera.lookAt(cameraTarget);
      // Keep the map point under the cursor fixed throughout the smooth zoom.
      if (
        zoomAnchor &&
        zoomAnchor.branchId === activeBranchRef.current &&
        time < zoomAnchor.until
      ) {
        camera.updateMatrixWorld();
        raycaster.setFromCamera(zoomAnchor.pointer, camera);
        const currentPoint = raycaster.ray.intersectPlane(zoomPlane, new THREE.Vector3());
        if (currentPoint) {
          const originX = selectedPin?.group.position.x ?? 0;
          const originZ = selectedPin?.group.position.z ?? 0;
          const nextX = THREE.MathUtils.clamp(
            panRef.current.x + zoomAnchor.point.x - currentPoint.x,
            countryBounds.min.x - originX,
            countryBounds.max.x - originX,
          );
          const nextZ = THREE.MathUtils.clamp(
            panRef.current.y + zoomAnchor.point.z - currentPoint.z,
            countryBounds.min.z - originZ,
            countryBounds.max.z - originZ,
          );
          const shift = new THREE.Vector3(nextX - panRef.current.x, 0, nextZ - panRef.current.y);
          panRef.current.set(nextX, nextZ);
          camera.position.add(shift);
          cameraTarget.add(shift);
          camera.lookAt(cameraTarget);
        }
      } else zoomAnchor = null;
      pins.forEach(({ group, ring }) => {
        const selected = group.userData.id === activeBranchRef.current;
        group.scale.setScalar(selected ? 1.26 : 1);
        ring.scale.setScalar(selected ? 1 + (Math.sin(time * 0.006) + 1) * 0.35 : 1);
      });
      renderer.render(scene, camera);
      const placed: { x: number; y: number; width: number }[] = [];
      pins.forEach(({ group }, index) => {
        const label = labelRefs.current[index];
        if (!label) return;
        // Hide overview labels at distant zoom levels; retain the selected office.
        const hideAtDistance =
          zoomRef.current < 0.95 && group.userData.id !== activeBranchRef.current;
        if (hideAtDistance) {
          label.style.visibility = "hidden";
          return;
        }
        const projected = group.getWorldPosition(new THREE.Vector3());
        projected.y += 0.45;
        projected.project(camera);
        const x = ((projected.x + 1) * width) / 2 + 12;
        let y = ((1 - projected.y) * height) / 2 - 14;
        const labelWidth = label.offsetWidth;
        for (let attempt = 0; attempt < 11; attempt++) {
          if (
            !placed.some(
              (other) =>
                x < other.x + other.width + 4 &&
                x + labelWidth + 4 > other.x &&
                Math.abs(y - other.y) < 30,
            )
          )
            break;
          y -= 30;
        }
        placed.push({ x, y, width: labelWidth });
        label.style.transform = `translate(${x}px, ${y}px)`;
        label.style.visibility = projected.z < -1 || projected.z > 1 ? "hidden" : "visible";
      });
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("click", selectPin);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
        if (object instanceof THREE.Sprite) object.material.dispose();
      });
      texture.dispose();
      terrainTexture.dispose();
      lightTexture.dispose();
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      renderer.dispose();
      country.geometry.dispose();
      ground.geometry.dispose();
    };
  }, [onSelect, onZoom]);
  return (
    <>
      <canvas
        className="three-map-canvas"
        ref={canvasRef}
        aria-label="แผนที่ประเทศไทยสามมิติพร้อมหมุดสาขา"
      />
      <div className="office-map-labels">
        {branches.map((branch, index) => (
          <button
            key={branch.id}
            ref={(element) => {
              labelRefs.current[index] = element;
            }}
            aria-pressed={activeBranch === branch.id}
            onClick={() => onSelect(branch.id)}
          >
            จ.{branch.name}
            {branch.hq ? " (สำนักงานใหญ่)" : ""}
          </button>
        ))}
      </div>
    </>
  );
}
